/**
 * Client service for Al-Waqza Super Admin Authentication & Security
 * Communicates with server endpoints for bcrypt validation, rate limiting,
 * session lifecycle, password updates, and audit logging.
 */

const TOKEN_KEY = 'alwaqza_super_admin_token';
const ADMIN_INFO_KEY = 'alwaqza_super_admin_info';

export interface SuperAdminInfo {
  username: string;
  role: 'super_admin';
  isInitialPassword?: boolean;
  lastPasswordChange?: string | null;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  admin?: SuperAdminInfo;
  error?: string;
  locked?: boolean;
  remainingSeconds?: number;
  remainingAttempts?: number;
}

export interface SecurityStatus {
  accountName: string;
  isInitialPassword: boolean;
  lastPasswordChange: string | null;
  activeSessionsCount: number;
  totalAuditLogs: number;
  recentSecurityEvents: AuditLog[];
  protectionStatus: {
    bcryptHashing: string;
    rateLimiter: string;
    sessionTerminationOnPasswordChange: string;
    serverAuthorityVerification: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ip: string;
  severity: 'info' | 'warning' | 'security' | 'critical';
}

export function getStoredAdminToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string, remember = false): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.warn('Storage set failed:', e);
  }
}

export function clearStoredAdminToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_INFO_KEY);
    localStorage.removeItem(ADMIN_INFO_KEY);
  } catch (e) {
    console.warn('Storage clear failed:', e);
  }
}

/**
 * Super Admin Login with server-side bcrypt verification and brute-force rate-limiting
 */
export async function loginSuperAdmin(password: string, username = 'المدير الرئيسي لمتجر الوقزة'): Promise<LoginResult> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'فشل تسجيل الدخول.',
        locked: data.locked || false,
        remainingSeconds: data.remainingSeconds,
        remainingAttempts: data.remainingAttempts,
      };
    }

    if (data.token) {
      setStoredAdminToken(data.token, true);
      try {
        sessionStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(data.admin));
      } catch {}
    }

    return {
      success: true,
      token: data.token,
      admin: data.admin,
    };
  } catch (err: any) {
    console.error('Admin login request failed:', err);
    return {
      success: false,
      error: 'تعذر الاتصال بخادم الحماية. يرجى التحقق من اتصال الشبكة.',
    };
  }
}

/**
 * Verify current session with server authority
 */
export async function verifyAdminSession(): Promise<{ valid: boolean; admin?: SuperAdminInfo }> {
  const token = getStoredAdminToken();
  if (!token) {
    return { valid: false };
  }

  try {
    const res = await fetch('/api/admin/verify-session', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      clearStoredAdminToken();
      return { valid: false };
    }

    const data = await res.json();
    return {
      valid: true,
      admin: data.admin,
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Terminate session securely on server and client
 */
export async function logoutSuperAdmin(): Promise<boolean> {
  const token = getStoredAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.warn('Server logout error:', e);
    }
  }
  clearStoredAdminToken();
  return true;
}

/**
 * Change Super Admin Password:
 * - Requires current password
 * - Hashes new password with bcrypt on server
 * - Revokes ALL active sessions
 * - Stores new active session
 */
export async function changeSuperAdminPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const token = getStoredAdminToken();
  if (!token) {
    return { success: false, error: 'انتهت الجلسة. يرجى تسجيل الدخول أولاً.' };
  }

  try {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'فشل تغيير كلمة المرور.' };
    }

    // Server returns new fresh session token after invalidating all previous ones
    if (data.newToken) {
      setStoredAdminToken(data.newToken, true);
    }

    return {
      success: true,
      message: data.message || 'تم تحديث كلمة المرور بنجاح وإنهاء كافة الجلسات السابقة.',
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'حدث خطأ في الاتصال بالخادم.' };
  }
}

/**
 * Fetch server-side audit logs
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  const token = getStoredAdminToken();
  if (!token) return [];

  try {
    const res = await fetch('/api/admin/audit-logs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch {
    return [];
  }
}

/**
 * Record an administrative operation in the server audit trail
 */
export async function recordAdminAuditLog(
  action: string,
  details: string,
  severity: 'info' | 'warning' | 'security' | 'critical' = 'info'
): Promise<void> {
  const token = getStoredAdminToken();
  if (!token) return;

  try {
    await fetch('/api/admin/audit-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, details, severity }),
    });
  } catch (e) {
    console.warn('Failed recording audit log:', e);
  }
}

/**
 * Fetch comprehensive security status from server
 */
export async function getSecurityStatus(): Promise<SecurityStatus | null> {
  const token = getStoredAdminToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/admin/security-status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
