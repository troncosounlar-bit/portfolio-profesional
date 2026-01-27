import React, { useState, useEffect } from 'react';
import { Database, X } from 'lucide-react'; // Eliminado AlertCircle
import { supabase } from '../lib/client';

/**
 * Componente que muestra un indicador discreto cuando se están usando datos de fallback
 * porque Supabase no está disponible.
 */
export const FallbackIndicator: React.FC = () => {
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    checkSupabaseStatus();
    
    // Verificar cada 30 segundos
    const interval = setInterval(() => {
      checkSupabaseStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      // Intentar una query simple para verificar conectividad
      const { error } = await supabase
        .from('hero_data')
        .select('id')
        .limit(1);

      if (error) {
        setIsUsingFallback(true);
      } else {
        setIsUsingFallback(false);
      }
    } catch (error) {
      setIsUsingFallback(true);
    }
    // Se eliminó el bloque finally que usaba isChecking
  };

  // No mostrar nada si Supabase está funcionando o si el usuario cerró el indicador
  if (!isUsingFallback || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Database className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-yellow-200/90 mb-1">
              Modo Offline
            </p>
            <p className="text-xs text-yellow-200/70">
              La base de datos no está disponible por mantenimiento. Estamos trabajando para que vuelva a estar activa pronto.
            </p>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 text-yellow-200/50 hover:text-yellow-200 transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};