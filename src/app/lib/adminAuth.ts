/**
 * SISTEMA DE AUTENTICACIÓN DEL ADMINISTRADOR (HÍBRIDO)
 * * Intenta autenticar contra Supabase. Si la base de datos está caída o pausada,
 * activa automáticamente el sistema de seguridad local (offline).
 */

import { supabase } from './client';
import { 
  checkAdminLogin as secureCheckLogin,
  isAuthenticated,
  getCurrentSession,
  logout as secureLogout,
  renewSession,
  isAccountLocked,
  getRemainingAttempts,
  getSessionInfo,
  changePassword // Asegúrate que esta función exista en secureAuth.ts
} from './secureAuth';

// Credenciales legacy (solo para referencia)
export const adminCredentials = {
  email: 'pablotroncoso.jobs@gmail.com',
  password: 'T88\'s Project',
};

/**
 * Verifica las credenciales del administrador (Lógica Híbrida)
 */
export const checkAdminLogin = async (
  email: string, 
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    // 1. INTENTO ONLINE (Supabase)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data?.session && !error) {
        return { success: true, message: '✅ Login exitoso (Online)' };
      }

      // Si el error NO es de red (ej. contraseña mal en la nube), lo reportamos
      if (error && error.message !== 'Failed to fetch' && error.message !== 'Network fetch decayed') {
        return { success: false, message: `❌ ${error.message}` };
      }
    } catch (onlineErr) {
      console.warn("🌐 Supabase no disponible, intentando validación local...");
    }

    // 2. MODO OFFLINE (Si falla la red o la DB está pausada)
    const result = await secureCheckLogin(email, password);
    return {
      success: result.success,
      message: result.message,
    };

  } catch (error) {
    console.error('❌ Error crítico en orquestador:', error);
    return {
      success: false,
      message: '❌ Error en el sistema de autenticación'
    };
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const checkAuth = (): boolean => {
  return isAuthenticated();
};

/**
 * Obtiene la sesión actual
 */
export const getSession = () => {
  return getCurrentSession();
};

/**
 * Cierra sesión (Limpia ambos sistemas)
 */
export const logout = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignorar errores de red al cerrar sesión
  }
  secureLogout();
};

/**
 * Renueva la sesión
 */
export const extendSession = (): boolean => {
  return renewSession();
};

// Re-exportar funciones de secureAuth para compatibilidad directa
export { isAccountLocked, getRemainingAttempts, getSessionInfo, changePassword };

/**
 * Verifica si la cuenta está bloqueada (wrapper)
 */
export const checkLockStatus = () => {
  return isAccountLocked();
};

/**
 * Obtiene el número de intentos restantes (wrapper)
 */
export const getAttemptsRemaining = (): number => {
  return getRemainingAttempts();
};

/**
 * Hook para auto-renovación de sesión
 */
export const setupSessionAutoRenewal = (): (() => void) => {
  const intervalId = setInterval(() => {
    if (isAuthenticated()) {
      const renewed = renewSession();
      if (renewed) {
        console.log('🔄 Sesión renovada automáticamente');
      }
    }
  }, 5 * 60 * 1000); // Cada 5 minutos

  return () => clearInterval(intervalId);
};