// src/app/hooks/useSupabaseStats.ts
import { useState, useEffect, useCallback } from 'react';
import { getStats } from '@/app/lib/services';
import { supabase } from '@/app/lib/client';  
import type { Stat } from '@/app/lib/types';
import { fallbackStats, applyLanguageToArray } from '../lib/fallbackData';
import { useLanguage } from '../contexts/LanguageContext';
import { getOfflineData } from '../lib/offlineStorage';

export const useSupabaseStats = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 1. Intentar traer datos base y vistas en paralelo
      const [statsRes, viewsRes] = await Promise.all([
        getStats(), // ✅ Usamos el servicio (adiós error 6133)
        supabase.from('page_views').select('count').eq('id', 1).single()
      ]);

      const realViews = viewsRes.data?.count || 0;

      if (statsRes && statsRes.length > 0) {
        // 2. Mapear traducciones y valor real de visitas (Online)
        const mappedData = statsRes.map(stat => {
          const isViews = stat.icon === 'eye' || stat.id === 'views';
          return {
            ...stat,
            label: language === 'en' && stat.label_en ? stat.label_en : stat.label,
            value: isViews ? `${realViews}+` : (language === 'en' && stat.value_en ? stat.value_en : stat.value)
          };
        });
        setStats(mappedData as Stat[]);
      } else {
        throw new Error("No stats found");
      }
    } catch (err) {
      // 3. Estrategia Offline
      const offline = getOfflineData();
      
      if (offline?.stats && offline.stats.length > 0) {
        const mappedOffline = offline.stats.map(stat => {
          const isViews = stat.icon === 'eye';
          return {
            ...stat,
            label: language === 'en' && stat.label_en ? stat.label_en : stat.label,
            value: isViews ? `${offline.pageViews || 0}+` : (language === 'en' && stat.value_en ? stat.value_en : stat.value)
          };
        });
        setStats(mappedOffline as Stat[]);
      } else {
        setStats(applyLanguageToArray(fallbackStats, language));
      }
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, refetch: fetchStats };
};