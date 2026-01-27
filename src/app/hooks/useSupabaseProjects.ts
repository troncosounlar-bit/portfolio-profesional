// src/app/hooks/useSupabaseProjects.ts
import { useEffect, useState, useCallback } from 'react';
import { getProjects } from '@/app/lib/services';
import type { Project } from '@/app/lib/types';
import { useLanguage } from '../contexts/LanguageContext';
import { fallbackProjects, applyLanguageToArray } from '../lib/fallbackData';
import { getOfflineData } from '../lib/offlineStorage';

export const useSupabaseProjects = () => {
  const { language } = useLanguage();
  // ✅ Tipamos el estado con la interfaz Project
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // ✅ 1. Usamos el servicio centralizado (adiós error de 'supabase' no encontrado)
      const data = await getProjects();

      if (data && data.length > 0) {
        // ✅ 2. Aplicamos traducción automática (adiós error de tipo 'any' en el map manual)
        setProjects(applyLanguageToArray(data, language));
      } else {
        throw new Error("No projects found in Supabase");
      }
    } catch (err) {
      // 3. Estrategia de recuperación Offline
      const offlineData = getOfflineData();
      
      if (offlineData?.projects && offlineData.projects.length > 0) {
        setProjects(applyLanguageToArray(offlineData.projects, language));
      } else {
        // Fallback final si no hay nada en caché ni en la nube
        setProjects(applyLanguageToArray(fallbackProjects, language));
      }
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, isLoading, refetch: fetchProjects };
};