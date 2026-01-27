// src/app/hooks/useSupabaseTechnologies.ts
import { useState, useEffect, useCallback } from 'react';
import { getTechnologies } from '@/app/lib/services';
import type { Technology } from '@/app/lib/types';
import { fallbackTechnologies } from '../lib/fallbackData';
import { getOfflineData } from '../lib/offlineStorage';

// ✅ SOLUCIÓN AL ERROR 2430:
// Omitimos tanto 'id' como 'logo_url' para redefinirlos sin conflictos de compatibilidad.
export interface TechnologyData extends Omit<Technology, 'id' | 'logo_url'> {
  id: string; 
  logo_url: string | null | undefined; // Ahora acepta ambos y no pelea con la interfaz base
}

const sanitizeTechnologies = (technologies: any[]): TechnologyData[] => {
  return technologies.map(tech => {
    const problematicDomains = ['ajeetchaulagain.com'];
    const hasProblematicUrl = tech.logo_url && 
      problematicDomains.some((domain: string) => tech.logo_url?.includes(domain));

    return { 
      ...tech, 
      id: tech.id || Math.random().toString(36).substring(2, 9),
      // Si es problemático, usamos null; de lo contrario, mantenemos lo que venga
      logo_url: hasProblematicUrl ? null : tech.logo_url 
    };
  });
};

export const useSupabaseTechnologies = () => {
  const [technologies, setTechnologies] = useState<TechnologyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnologies = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTechnologies();

      if (data && data.length > 0) {
        setTechnologies(sanitizeTechnologies(data));
        setError(null);
      } else {
        throw new Error("No data found");
      }
    } catch (err: any) {
      const offline = getOfflineData();
      if (offline?.technologies && offline.technologies.length > 0) {
        setTechnologies(sanitizeTechnologies(offline.technologies));
      } else {
        setTechnologies(sanitizeTechnologies(fallbackTechnologies));
      }
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  return { technologies, isLoading, error, refetch: fetchTechnologies };
};