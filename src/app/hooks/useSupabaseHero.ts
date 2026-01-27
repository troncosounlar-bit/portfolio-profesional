// src/app/hooks/useSupabaseHero.ts
import { useState, useEffect, useCallback } from 'react';
import { getHeroData } from '../lib/services';
import type { HeroData } from '../lib/types';
import { fallbackHeroData, applyLanguageToData } from '../lib/fallbackData';
import { useLanguage } from '../contexts/LanguageContext';
import { getOfflineData } from '../lib/offlineStorage';

export const useSupabaseHero = () => {
  const { language } = useLanguage();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHeroData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // ✅ Usamos el servicio que ya tiene acceso al cliente real de Supabase
      const data = await getHeroData();

      if (data) {
        // Aplicamos la lógica de traducción (la utilidad ya maneja los campos _en)
        setHeroData(applyLanguageToData(data, language));
      } else {
        throw new Error("No data found");
      }
    } catch (err) {
      // Intento de recuperación desde Offline Storage
      const offlineBackup = getOfflineData();
      
      if (offlineBackup?.heroData) {
        setHeroData(applyLanguageToData(offlineBackup.heroData, language));
      } else {
        // Fallback final: Datos de emergencia
        setHeroData(applyLanguageToData(fallbackHeroData, language));
      }
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);

  return { heroData, isLoading, refetch: fetchHeroData };
};