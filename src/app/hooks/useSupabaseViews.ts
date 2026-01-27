// src/app/hooks/useSupabaseViews.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/client'; 
import { getOfflineData } from '../lib/offlineStorage';

const FALLBACK_VIEWS = Math.floor(Math.random() * 400) + 100;

export const useSupabaseViews = () => {
  const [views, setViews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndIncrementViews = async () => {
      try {
        setIsLoading(true);

        // ✅ CORRECCIÓN: Verificar configuración usando variables de entorno de Vite
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        
        if (!supabaseUrl || supabaseUrl === '' || supabaseUrl.includes('your-project-id')) {
          console.info('ℹ️ Usando contador de visitas de demostración (Supabase no configurado)');
          const localData = getOfflineData();
          setViews(localData?.pageViews || FALLBACK_VIEWS);
          setIsLoading(false);
          return;
        }

        // 1. Obtener el contador actual
        const { data: currentData, error: fetchError } = await supabase
          .from('page_views')
          .select('count')
          .eq('id', 1)
          .single();

        // PGRST116 significa que no se encontró el registro (está vacío)
        if (fetchError && fetchError.code !== 'PGRST116') {
          const localData = getOfflineData();
          setViews(localData?.pageViews || FALLBACK_VIEWS);
          setIsLoading(false);
          return;
        }

        const currentCount = currentData?.count || 0;
        const hasVisited = localStorage.getItem('portfolio_visited');

        if (!hasVisited) {
          const newCount = currentCount + 1;
          
          // 2. Intentar incrementar (Upsert)
          const { error: upsertError } = await supabase
            .from('page_views')
            .upsert({ id: 1, count: newCount });

          if (upsertError) {
            // Si hay error por RLS o permisos, mostramos el actual sin incrementar
            setViews(currentCount);
          } else {
            setViews(newCount);
            localStorage.setItem('portfolio_visited', 'true');
          }
        } else {
          setViews(currentCount);
        }

        setError(null);
      } catch (err: any) {
        const localData = getOfflineData();
        setViews(localData?.pageViews || FALLBACK_VIEWS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndIncrementViews();
  }, []);

  return { views, isLoading, error };
};