import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Password hash for admin (default password: "alwaqza4558*sto21")
let currentPasswordHash =
  process.env.ADMIN_PASSWORD_HASH ||
  '$2a$10$WqB6e8QWbYgD2o6dKqE4eOOqUjJ.5UaFpP/b49J9G/87Q5dM0oMfe';

const auditLogsFile = path.resolve(process.cwd(), 'server-data', 'audit-logs.json');
let auditLogs: any[] = [];

try {
  if (fs.existsSync(auditLogsFile)) {
    auditLogs = JSON.parse(fs.readFileSync(auditLogsFile, 'utf8'));
  }
} catch {
  auditLogs = [];
}

const saveAuditLog = (event: string, success: boolean, ip: string, details?: string) => {
  const entry = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    event,
    success,
    ip,
    details
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 50) auditLogs.pop();
  try {
    const dir = path.dirname(auditLogsFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(auditLogsFile, JSON.stringify(auditLogs, null, 2));
  } catch {}
};

// Rate limiter for admin login (max 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة بعد 15 دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false
});

let failedCount = 0;
let totalLogins = 0;

// Admin Login endpoint
app.post('/api/admin/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!password) {
    saveAuditLog('محاولة تسجيل دخول بدون كلمة مرور', false, clientIp);
    return res.status(400).json({ success: false, message: 'كلمة المرور مطلوبة' });
  }

  const isValid = bcrypt.compareSync(password, currentPasswordHash);

  if (!isValid) {
    failedCount++;
    saveAuditLog('محاولة تسجيل دخول فاشلة', false, clientIp, 'كلمة المرور غير صحيحة');
    return res.status(401).json({ success: false, message: 'كلمة المرور غير صحيحة' });
  }

  totalLogins++;
  saveAuditLog('تسجيل دخول ناجح للمشرف', true, clientIp);
  const token = 'alwaqza_sec_' + Buffer.from(Date.now() + ':' + clientIp).toString('base64');
  return res.json({ success: true, token });
});

// Admin Verify endpoint
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer alwaqza_sec_')) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false });
});

// Admin Logout endpoint
app.post('/api/admin/logout', (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  saveAuditLog('تسجيل خروج المشرف', true, clientIp);
  return res.json({ success: true });
});

// Admin Change Password endpoint
app.post('/api/admin/change-password', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer alwaqza_sec_')) {
    return res.status(401).json({ success: false, message: 'غير مصرح' });
  }

  const { currentPassword, newPassword } = req.body;
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'البيانات غير مكتملة' });
  }

  const isValid = bcrypt.compareSync(currentPassword, currentPasswordHash);
  if (!isValid) {
    saveAuditLog('فشل تغيير كلمة المرور - كلمة المرور الحالية خاطئة', false, clientIp);
    return res.status(400).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
  }

  currentPasswordHash = bcrypt.hashSync(newPassword, 10);
  saveAuditLog('تم تغيير كلمة مرور المشرف بنجاح', true, clientIp);
  return res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
});

// Audit Logs endpoint
app.get('/api/admin/audit-logs', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer alwaqza_sec_')) {
    return res.status(401).json({ success: false, message: 'غير مصرح' });
  }
  return res.json({ logs: auditLogs });
});

// Security Stats endpoint
app.get('/api/admin/security-stats', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer alwaqza_sec_')) {
    return res.status(401).json({ success: false, message: 'غير مصرح' });
  }
  return res.json({
    stats: {
      failedAttempts: failedCount,
      totalLogins,
      isLocked: false
    }
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
