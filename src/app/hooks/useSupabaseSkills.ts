// src/app/hooks/useSupabaseSkills.ts
import { useState, useEffect, useCallback } from 'react';
import { getAllSkillsWithCategories } from '@/app/lib/services';
import type { Skill, SkillCategory } from '@/app/lib/types';
import { fallbackSkillCategories } from '../lib/fallbackData';
import { getOfflineData } from '../lib/offlineStorage';

// ✅ Definimos un tipo que extienda el global para asegurar compatibilidad
export interface SkillCategoryData extends Omit<SkillCategory, 'id'> {
  id: string; // Forzamos a que el ID sea string para la UI
  skills: Skill[];
}

export const useSupabaseSkills = () => {
  // ✅ Usamos tipos más flexibles para evitar errores de asignación
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // ✅ 1. Usamos el servicio centralizado (adiós error de 'supabase' importado como tipo)
      const data = await getAllSkillsWithCategories();

      if (data && data.length > 0) {
        setSkillCategories(data);
        setError(null);
      } else {
        throw new Error("No data found");
      }
    } catch (err: any) {
      // 2. Modo offline silencioso
      const offlineBackup = getOfflineData();
      
      if (offlineBackup?.skillCategories && offlineBackup.skillCategories.length > 0) {
        setSkillCategories(offlineBackup.skillCategories);
      } else {
        // Fallback final: Datos estáticos
        setSkillCategories(fallbackSkillCategories);
      }
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skillCategories, isLoading, error, refetch: fetchSkills };
};