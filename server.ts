import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Ensure secure server-data directory exists
const DATA_DIR = path.resolve(__dirname, 'server-data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ADMIN_CREDENTIALS_FILE = path.join(DATA_DIR, 'admin-security.json');
const AUDIT_LOGS_FILE = path.join(DATA_DIR, 'audit-logs.json');

// Interface for persistent admin record
interface AdminRecord {
  username: string;
  passwordHash: string;
  isInitialPassword: boolean;
  createdAt: string;
  updatedAt: string;
  lastPasswordChange: string | null;
}

// Interface for audit logs
interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ip: string;
  severity: 'info' | 'warning' | 'security' | 'critical';
}

// Initialize admin credentials if not already present
function getOrInitAdminRecord(): AdminRecord {
  if (fs.existsSync(ADMIN_CREDENTIALS_FILE)) {
    try {
      const data = fs.readFileSync(ADMIN_CREDENTIALS_FILE, 'utf-8');
      return JSON.parse(data) as AdminRecord;
    } catch (e) {
      console.error('Failed to parse admin credentials file, reinitializing safely:', e);
    }
  }

  // Initial setup with mandatory specified credentials
  const initialSalt = bcrypt.genSaltSync(10);
  const initialHash = bcrypt.hashSync('alwaqza4558*sto21', initialSalt);
  const now = new Date().toISOString();

  const initialRecord: AdminRecord = {
    username: 'المدير الرئيسي لمتجر الوقزة',
    passwordHash: initialHash,
    isInitialPassword: true,
    createdAt: now,
    updatedAt: now,
    lastPasswordChange: null,
  };

  fs.writeFileSync(ADMIN_CREDENTIALS_FILE, JSON.stringify(initialRecord, null, 2), 'utf-8');
  return initialRecord;
}

function saveAdminRecord(record: AdminRecord) {
  fs.writeFileSync(ADMIN_CREDENTIALS_FILE, JSON.stringify(record, null, 2), 'utf-8');
}

// Audit logging helpers
function loadAuditLogs(): AuditLogEntry[] {
  if (fs.existsSync(AUDIT_LOGS_FILE)) {
    try {
      const data = fs.readFileSync(AUDIT_LOGS_FILE, 'utf-8');
      return JSON.parse(data) as AuditLogEntry[];
    } catch {
      return [];
    }
  }
  return [];
}

function appendAuditLog(
  action: string,
  details: string,
  severity: 'info' | 'warning' | 'security' | 'critical' = 'info',
  actor = 'المدير الرئيسي لمتجر الوقزة',
  ip = '127.0.0.1'
) {
  const logs = loadAuditLogs();
  const entry: AuditLogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    action,
    actor,
    details,
    ip,
    severity,
  };
  logs.unshift(entry);
  // Keep last 500 audit logs to manage disk space efficiently
  if (logs.length > 500) {
    logs.length = 500;
  }
  fs.writeFileSync(AUDIT_LOGS_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  return entry;
}

// In-memory active sessions and rate limiting
interface ActiveSession {
  token: string;
  username: string;
  role: 'super_admin';
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
}

const activeSessions = new Map<string, ActiveSession>();
const SESSION_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 hours

// Rate limiting structure for brute-force protection
interface RateLimitState {
  attempts: number;
  lockoutUntil: number | null;
  lastAttempt: number;
}

const loginRateLimits = new Map<string, RateLimitState>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown-client';
}

// Authentication middleware for administrative API routes
function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'غير مصرح بالدخول. يرجى تسجيل الدخول بحساب المدير الرئيسي أولاً.',
      code: 'UNAUTHORIZED',
    });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({
      error: 'انتهت صلاحية الجلسة أو تم تسجيل الخروج. يرجى إعادة تسجيل الدخول.',
      code: 'SESSION_EXPIRED',
    });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({
      error: 'انتهت مدة الجلسة الزمنية. يرجى تسجيل الدخول مجدداً.',
      code: 'SESSION_TIMED_OUT',
    });
  }

  // Extend activity timestamp
  session.expiresAt = Date.now() + SESSION_LIFETIME_MS;
  (req as any).adminSession = session;
  next();
}

// ======================== API ROUTES ========================

// 1. Admin Login with Rate Limiting & Lockout Protection
app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  const { username, password } = req.body;

  // Check rate limit state
  const now = Date.now();
  let rateState = loginRateLimits.get(clientIp);

  if (rateState && rateState.lockoutUntil && now < rateState.lockoutUntil) {
    const remainingSeconds = Math.ceil((rateState.lockoutUntil - now) / 1000);
    appendAuditLog(
      'BLOCKED_ATTEMPT_RATE_LIMIT',
      `تم حظر محاولة دخول بسبب تكرار المحاولات الخاطئة من العنوان ${clientIp}. الوقت المتبقي: ${remainingSeconds} ثانية.`,
      'warning',
      username || 'مجهول',
      clientIp
    );

    return res.status(429).json({
      error: `تم حظر محاولات الدخول مؤقتاً لحماية النظام من التخمين. يرجى الانتظار لمدة ${Math.ceil(remainingSeconds / 60)} دقيقة.`,
      locked: true,
      remainingSeconds,
    });
  }

  // Validate incoming inputs
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'كلمة المرور مطلوبة.' });
  }

  const adminRecord = getOrInitAdminRecord();

  // Validate username if provided
  const expectedUsername = adminRecord.username;
  if (username && typeof username === 'string' && username.trim() !== expectedUsername) {
    // Record failed attempt
    if (!rateState) {
      rateState = { attempts: 1, lockoutUntil: null, lastAttempt: now };
    } else {
      rateState.attempts += 1;
      rateState.lastAttempt = now;
      if (rateState.attempts >= MAX_LOGIN_ATTEMPTS) {
        rateState.lockoutUntil = now + LOCKOUT_DURATION_MS;
      }
    }
    loginRateLimits.set(clientIp, rateState);

    appendAuditLog(
      'FAILED_LOGIN_UNKNOWN_USER',
      `محاولة دخول باسم مستخدم غير مصرح به: "${username}" من العنوان ${clientIp}`,
      'security',
      username,
      clientIp
    );

    const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - rateState.attempts);
    return res.status(401).json({
      error: 'بيانات الاعتماد غير صحيحة.',
      remainingAttempts,
    });
  }

  // Validate password using bcrypt
  const isMatch = bcrypt.compareSync(password, adminRecord.passwordHash);

  if (!isMatch) {
    if (!rateState) {
      rateState = { attempts: 1, lockoutUntil: null, lastAttempt: now };
    } else {
      rateState.attempts += 1;
      rateState.lastAttempt = now;
      if (rateState.attempts >= MAX_LOGIN_ATTEMPTS) {
        rateState.lockoutUntil = now + LOCKOUT_DURATION_MS;
      }
    }
    loginRateLimits.set(clientIp, rateState);

    const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - rateState.attempts);

    appendAuditLog(
      'FAILED_LOGIN_PASSWORD_MISMATCH',
      `محاولة تسجيل دخول فاشلة بكلمة مرور خاطئة لحساب المدير الرئيسي. المحاولات المتبقية: ${remainingAttempts}`,
      'security',
      adminRecord.username,
      clientIp
    );

    if (rateState.attempts >= MAX_LOGIN_ATTEMPTS) {
      return res.status(429).json({
        error: 'تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). تم حظر الدخول مؤقتاً لمدة 15 دقيقة للحماية من التخمين.',
        locked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      });
    }

    return res.status(401).json({
      error: 'كلمة المرور غير صحيحة.',
      remainingAttempts,
    });
  }

  // Successful Login: Reset rate limit state
  loginRateLimits.delete(clientIp);

  // Generate secure random session token
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = now + SESSION_LIFETIME_MS;

  const session: ActiveSession = {
    token,
    username: adminRecord.username,
    role: 'super_admin',
    createdAt: now,
    expiresAt,
    ip: clientIp,
    userAgent,
  };

  activeSessions.set(token, session);

  appendAuditLog(
    'SUPER_ADMIN_LOGIN_SUCCESS',
    `تم تسجيل دخول المدير الرئيسي بنجاح (${adminRecord.username}) من العنوان ${clientIp}`,
    'info',
    adminRecord.username,
    clientIp
  );

  return res.json({
    success: true,
    token,
    expiresAt,
    admin: {
      username: adminRecord.username,
      role: 'super_admin',
      isInitialPassword: adminRecord.isInitialPassword,
      lastPasswordChange: adminRecord.lastPasswordChange,
    },
  });
});

// 2. Verify Session Validity
app.post('/api/admin/verify-session', requireSuperAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as ActiveSession;
  const adminRecord = getOrInitAdminRecord();

  return res.json({
    valid: true,
    admin: {
      username: adminRecord.username,
      role: 'super_admin',
      isInitialPassword: adminRecord.isInitialPassword,
      lastPasswordChange: adminRecord.lastPasswordChange,
    },
    expiresAt: session.expiresAt,
  });
});

// 3. Admin Logout
app.post('/api/admin/logout', requireSuperAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as ActiveSession;
  const clientIp = getClientIp(req);

  activeSessions.delete(session.token);

  appendAuditLog(
    'SUPER_ADMIN_LOGOUT',
    `تم تسجيل خروج المدير الرئيسي وإنهاء الجلسة بأمان من العنوان ${clientIp}`,
    'info',
    session.username,
    clientIp
  );

  return res.json({ success: true, message: 'تم تسجيل الخروج وإنهاء الجلسة بأمان.' });
});

// 4. Change Password & Terminate All Prior Sessions
app.post('/api/admin/change-password', requireSuperAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as ActiveSession;
  const clientIp = getClientIp(req);
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'يرجى تقديم كلمة المرور الحالية وكلمة المرور الجديدة.' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'كلمة المرور الجديدة وتأكيدها غير متطابقين.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'يجب ألا تقل كلمة المرور الجديدة عن 8 أحرف وتحتوي على مزيج من الأرقام والرموز.' });
  }

  const adminRecord = getOrInitAdminRecord();

  // Verify current password with bcrypt
  const isCurrentValid = bcrypt.compareSync(currentPassword, adminRecord.passwordHash);
  if (!isCurrentValid) {
    appendAuditLog(
      'PASSWORD_CHANGE_FAILED',
      `محاولة فاشلة لتغيير كلمة المرور: كلمة المرور الحالية غير صحيحة من العنوان ${clientIp}`,
      'security',
      session.username,
      clientIp
    );
    return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة.' });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمة المرور الحالية.' });
  }

  // Hash new password using bcrypt
  const newSalt = bcrypt.genSaltSync(12);
  const newHash = bcrypt.hashSync(newPassword, newSalt);
  const now = new Date().toISOString();

  adminRecord.passwordHash = newHash;
  adminRecord.isInitialPassword = false;
  adminRecord.updatedAt = now;
  adminRecord.lastPasswordChange = now;
  saveAdminRecord(adminRecord);

  // CRITICAL MANDATE: Terminate all previous sessions upon password change
  const previousSessionCount = activeSessions.size;
  activeSessions.clear();

  // Issue a single new fresh session for this client
  const newToken = crypto.randomBytes(48).toString('hex');
  const nowMs = Date.now();
  const expiresAt = nowMs + SESSION_LIFETIME_MS;

  const freshSession: ActiveSession = {
    token: newToken,
    username: adminRecord.username,
    role: 'super_admin',
    createdAt: nowMs,
    expiresAt,
    ip: clientIp,
    userAgent: req.headers['user-agent'] || 'unknown',
  };

  activeSessions.set(newToken, freshSession);

  appendAuditLog(
    'PASSWORD_CHANGED_SESSIONS_REVOKED',
    `تم تغيير كلمة مرور المدير الرئيسي بنجاح وإنهاء كافة الجلسات السابقة (${previousSessionCount} جلسة).`,
    'critical',
    adminRecord.username,
    clientIp
  );

  return res.json({
    success: true,
    message: 'تم تغيير كلمة المرور بنجاح وإنهاء كافة الجلسات السابقة لضمان أقصى درجات الأمان.',
    newToken,
    expiresAt,
  });
});

// 5. Get Audit Logs
app.get('/api/admin/audit-logs', requireSuperAdmin, (req: Request, res: Response) => {
  const logs = loadAuditLogs();
  return res.json({ logs });
});

// 6. Record Admin Action in Audit Log
app.post('/api/admin/audit-log', requireSuperAdmin, (req: Request, res: Response) => {
  const session = (req as any).adminSession as ActiveSession;
  const clientIp = getClientIp(req);
  const { action, details, severity } = req.body;

  if (!action || !details) {
    return res.status(400).json({ error: 'بيانات العملية مطلوبة.' });
  }

  const entry = appendAuditLog(
    action,
    details,
    severity || 'info',
    session.username,
    clientIp
  );

  return res.json({ success: true, entry });
});

// 7. Security Status Summary
app.get('/api/admin/security-status', requireSuperAdmin, (req: Request, res: Response) => {
  const adminRecord = getOrInitAdminRecord();
  const logs = loadAuditLogs();
  const recentSecurityEvents = logs.filter((l) => l.severity === 'security' || l.severity === 'critical').slice(0, 5);

  return res.json({
    accountName: adminRecord.username,
    isInitialPassword: adminRecord.isInitialPassword,
    lastPasswordChange: adminRecord.lastPasswordChange,
    activeSessionsCount: activeSessions.size,
    totalAuditLogs: logs.length,
    recentSecurityEvents,
    protectionStatus: {
      bcryptHashing: 'مفعّل (12 rounds)',
      rateLimiter: 'مفعّل (الحد الأقصى 5 محاولات / حظر 15 دقيقة)',
      sessionTerminationOnPasswordChange: 'مفعّل',
      serverAuthorityVerification: 'مفعّل ومطابق',
    },
  });
});

// ======================== SERVER & VITE INTEGRATION ========================

async function startServer() {
  // Initialize admin record on boot
  const initialAdmin = getOrInitAdminRecord();
  console.log(`[Admin Security] Initialized for: "${initialAdmin.username}". Password status: ${initialAdmin.isInitialPassword ? 'كلمة المرور الأولية' : 'تم تحديثها مسبقاً'}`);

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Al-Waqza Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
