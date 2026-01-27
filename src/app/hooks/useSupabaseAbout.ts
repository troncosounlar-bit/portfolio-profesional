// src/app/hooks/useSupabaseAbout.ts
import { useState, useEffect, useCallback } from 'react';
// Importamos las funciones que ya creamos en services para mantener el código limpio
import { getAboutData, getWorkPhilosophy } from '../lib/services';
import type { AboutData, WorkPhilosophy } from '../lib/types';
import { 
  fallbackAboutData, 
  fallbackWorkPhilosophy, 
  applyLanguageToData, 
  applyLanguageToArray 
} from '../lib/fallbackData';
import { useLanguage } from '../contexts/LanguageContext';
import { getOfflineData } from '../lib/offlineStorage';

export const useSupabaseAbout = () => {
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [workPhilosophy, setWorkPhilosophy] = useState<WorkPhilosophy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAboutData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Usamos los servicios que ya manejan la lógica de Supabase
      const [aboutRes, philosophyRes] = await Promise.all([
        getAboutData(),
        getWorkPhilosophy()
      ]);

      // 1. PROCESAR ABOUT DATA
      if (aboutRes) {
        setAboutData(applyLanguageToData(aboutRes, language));
      } else {
        // Si falla Supabase, vamos al backup local
        const backup = getOfflineData();
        const localAbout = backup?.aboutData || fallbackAboutData;
        setAboutData(applyLanguageToData(localAbout, language));
      }

      // 2. PROCESAR FILOSOFÍA
      if (philosophyRes && philosophyRes.length > 0) {
        setWorkPhilosophy(applyLanguageToArray(philosophyRes, language));
      } else {
        const backup = getOfflineData();
        const localPhil = (backup?.workPhilosophy && backup.workPhilosophy.length > 0) 
          ? backup.workPhilosophy 
          : fallbackWorkPhilosophy;
        setWorkPhilosophy(applyLanguageToArray(localPhil, language));
      }

    } catch (err) {
      // Fallback total en caso de error crítico
      const backup = getOfflineData();
      setAboutData(applyLanguageToData(backup?.aboutData || fallbackAboutData, language));
      setWorkPhilosophy(applyLanguageToArray(backup?.workPhilosophy || fallbackWorkPhilosophy, language));
    } finally {
      setIsLoading(false);
    }
  }, [language]); // Depende del idioma para re-procesar los textos

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  return { aboutData, workPhilosophy, isLoading, refetch: fetchAboutData };
};