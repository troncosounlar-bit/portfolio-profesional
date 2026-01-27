// src/app/hooks/useSupabaseExperiences.ts
import { useState, useEffect, useCallback } from 'react';
import { getExperiences } from '../lib/services'; 
import type { Experience } from '../lib/types';
import { useLanguage } from '../contexts/LanguageContext';
import { fallbackExperiences, applyLanguageToArray } from '../lib/fallbackData';
import { getOfflineData } from '../lib/offlineStorage';

export const useSupabaseExperiences = () => {
  const { language } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExperiences = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // ✅ Usamos la función del servicio en lugar de llamar a supabase directamente
      const data = await getExperiences();

      if (data && data.length > 0) {
        // Procesamos las traducciones usando la utilidad que ya tienes importada
        setExperiences(applyLanguageToArray(data, language));
      } else {
        // Si no hay datos, intentamos cargar del backup offline
        const localBackup = getOfflineData();
        const rawExperiences = (localBackup?.experiences && localBackup.experiences.length > 0) 
          ? localBackup.experiences 
          : fallbackExperiences;

        setExperiences(applyLanguageToArray(rawExperiences, language));
      }
    } catch (err) {
      // Fallback en caso de error de red
      const localBackup = getOfflineData();
      const rawExperiences = (localBackup?.experiences && localBackup.experiences.length > 0) 
        ? localBackup.experiences 
        : fallbackExperiences;

      setExperiences(applyLanguageToArray(rawExperiences, language));
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return { experiences, isLoading, refetch: fetchExperiences };
};