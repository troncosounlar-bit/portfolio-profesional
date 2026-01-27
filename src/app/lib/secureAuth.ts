/**
 * SISTEMA DE AUTENTICACIÓN SEGURA OFFLINE - COMPLETO Y CORREGIDO
 */

const ADMIN_EMAIL = 'pablotroncoso.jobs@gmail.com';
const PASSWORD_HASH_KEY = 'admin_password_hash';
const ATTEMPTS_KEY = 'login_attempts';
const SESSION_KEY = 'admin_session';

// Configuración de seguridad
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutos
const SESSION_TIMEOUT = 60 * 60 * 1000;  // 60 minutos

let ADMIN_PASSWORD_HASH = '';

// --- INTERFACES ---

export interface SessionData {
  token: string;
  email: string;
  timestamp: number;
  expiresAt: number;
}

interface LoginAttempts {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// --- UTILIDADES DE CRIPTOGRAFÍA ---

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Inicializa el hash de la contraseña.
 */
async function initializeHash() {
  if (typeof window === 'undefined') return;
  
  const saved = localStorage.getItem(PASSWORD_HASH_KEY);
  if (saved) {
    ADMIN_PASSWORD_HASH = saved;
  } else {
    const initialHash = await hashPassword("T88's Project");
    ADMIN_PASSWORD_HASH = initialHash;
    localStorage.setItem(PASSWORD_HASH_KEY, initialHash);
  }
}

// Ejecutar inicialización
if (typeof window !== 'undefined') {
  initializeHash();
}

// --- GESTIÓN DE INTENTOS ---

function getLoginAttempts(): LoginAttempts {
  if (typeof window === 'undefined') return { count: 0, lastAttempt: 0 };
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    return data ? JSON.parse(data) : { count: 0, lastAttempt: 0 };
  } catch {
    return { count: 0, lastAttempt: 0 };
  }
}

function saveLoginAttempts(attempts: LoginAttempts): void {
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
}

export function isAccountLocked(): { locked: boolean; remainingTime?: number } {
  const attempts = getLoginAttempts();
  
  if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
    const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
    return { locked: true, remainingTime };
  }
  
  if (attempts.lockedUntil && attempts.lockedUntil <= Date.now()) {
    saveLoginAttempts({ count: 0, lastAttempt: 0 });
  }
  
  return { locked: false };
}

export function getRemainingAttempts(): number {
  const attempts = getLoginAttempts();
  return Math.max(0, MAX_LOGIN_ATTEMPTS - attempts.count);
}

function recordFailedAttempt(): void {
  const attempts = getLoginAttempts();
  const newCount = attempts.count + 1;
  const newAttempts: LoginAttempts = {
    count: newCount,
    lastAttempt: Date.now(),
  };

  if (newCount >= MAX_LOGIN_ATTEMPTS) {
    newAttempts.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }
  
  saveLoginAttempts(newAttempts);
}

// --- FUNCIONES PRINCIPALES ---

export async function checkAdminLogin(email: string, password: string): Promise<{
  success: boolean;
  message?: string;
  session?: SessionData;
}> {
  const lockStatus = isAccountLocked();
  if (lockStatus.locked) {
    return {
      success: false,
      message: `🔒 Cuenta bloqueada. Reintenta en ${lockStatus.remainingTime} min.`,
    };
  }

  if (!email || !password) {
    return { success: false, message: '❌ Email y contraseña requeridos' };
  }

  if (!ADMIN_PASSWORD_HASH) await initializeHash();

  const hashedInput = await hashPassword(password);

  if (email !== ADMIN_EMAIL || hashedInput !== ADMIN_PASSWORD_HASH) {
    recordFailedAttempt();
    return {
      success: false,
      message: `❌ Credenciales inválidas. Intentos restantes: ${getRemainingAttempts()}`,
    };
  }

  saveLoginAttempts({ count: 0, lastAttempt: 0 });
  const session = createSession(email);
  
  return { success: true, message: '✅ Login exitoso', session };
}

function createSession(email: string): SessionData {
  const now = Date.now();
  const session: SessionData = {
    token: generateSessionToken(),
    email,
    timestamp: now,
    expiresAt: now + SESSION_TIMEOUT,
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getCurrentSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    
    const session: SessionData = JSON.parse(data);
    if (session.expiresAt < Date.now()) {
      logout();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function renewSession(): boolean {
  const session = getCurrentSession();
  if (session) {
    createSession(session.email);
    return true;
  }
  return false;
}

export function getSessionInfo() {
  return getCurrentSession();
}

/**
 * Cambia la contraseña del administrador
 * @param currentPassword - La contraseña actual (para verificación)
 * @param newPassword - La nueva contraseña
 * @returns Objeto con success y mensaje
 */
export async function changePassword(
  currentPassword: string, 
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verificar que ambos parámetros existan
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        message: '❌ Se requieren ambas contraseñas'
      };
    }

    // Validar longitud mínima de la nueva contraseña
    if (newPassword.length < 6) {
      return {
        success: false,
        message: '❌ La nueva contraseña debe tener al menos 6 caracteres'
      };
    }

    // Inicializar hash si es necesario
    if (!ADMIN_PASSWORD_HASH) await initializeHash();

    // Verificar que la contraseña actual sea correcta
    const currentHash = await hashPassword(currentPassword);
    if (currentHash !== ADMIN_PASSWORD_HASH) {
      return {
        success: false,
        message: '❌ La contraseña actual es incorrecta'
      };
    }

    // Hashear y guardar la nueva contraseña
    const newHash = await hashPassword(newPassword);
    ADMIN_PASSWORD_HASH = newHash;
    localStorage.setItem(PASSWORD_HASH_KEY, newHash);
    
    console.log('✅ Contraseña actualizada correctamente');
    return {
      success: true,
      message: '✅ Contraseña cambiada exitosamente'
    };
  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error);
    return {
      success: false,
      message: '❌ Error al cambiar la contraseña'
    };
  }
}

// Mantener compatibilidad con el nombre que tenías antes
export const updateAdminPassword = changePassword;

// Exponer utilidades al objeto window para debug
if (typeof window !== 'undefined') {
  (window as any).updateAdminPassword = updateAdminPassword;
  (window as any).generatePasswordHash = hashPassword;
}