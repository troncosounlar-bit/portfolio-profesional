import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/client'; 

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Si Supabase no está disponible, simplemente no autenticamos
      console.info('ℹ️ No se pudo verificar la autenticación (base de datos no disponible)');
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      // Manejo de errores más específico
      if (error.message && error.message.includes('fetch')) {
        setAuthError('No se pudo conectar a la base de datos. Verifica tu conexión a Supabase.');
      } else {
        setAuthError(error.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      // Si falla el logout, limpiamos el estado de todas formas
      console.info('ℹ️ Error al cerrar sesión, pero se limpió el estado local');
      setIsAuthenticated(false);
      setEmail('');
      setPassword('');
    }
  };

  return {
    isAuthenticated,
    email,
    setEmail,
    password,
    setPassword,
    authError,
    isLoading,
    handleLogin,
    handleLogout,
  };
};