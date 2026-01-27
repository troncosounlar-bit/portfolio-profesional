/**
 * SISTEMA DE ALMACENAMIENTO OFFLINE - ACTUALIZADO
 * * Gestiona el almacenamiento local de datos como respaldo de Supabase.
 * Permite Dual-Write (escribir en la nube y local a la vez) y CRUD local.
 */

import { 
  HeroData, 
  AboutData, 
  WorkPhilosophy, 
  Experience, 
  Project, 
  Skill, 
  SkillCategory,
  Stat,
  Technology,
  ContactSubmission,
  StyleSettings
} from './types';
import { fallbackData } from './fallbackData';

export interface OfflineData {
  styleSettings: StyleSettings;
  heroData: HeroData;
  aboutData: AboutData;
  workPhilosophy: WorkPhilosophy[];
  experiences: Experience[];
  projects: Project[];
  stats: Stat[];
  skillCategories: Array<SkillCategory & { skills: Skill[] }>;
  technologies: Technology[];
  messages: ContactSubmission[];
  pageViews: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'portfolio_offline_data';
const BACKUP_KEY = 'portfolio_offline_backup';

/**
 * Obtiene los datos offline. Si no existen, devuelve el fallbackData inicial.
 */
export const getOfflineData = (): OfflineData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Inicializamos con los datos del archivo fallback (convertido a OfflineData)
      const initialData = { 
        ...fallbackData, 
        lastUpdated: new Date().toISOString() 
      } as unknown as OfflineData;
      return initialData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error al cargar datos offline:', error);
    return { 
      ...fallbackData, 
      lastUpdated: new Date().toISOString() 
    } as unknown as OfflineData;
  }
};

/**
 * Guarda un objeto completo de OfflineData
 */
export const saveOfflineData = (data: OfflineData): boolean => {
  try {
    const currentData = localStorage.getItem(STORAGE_KEY);
    if (currentData) {
      localStorage.setItem(BACKUP_KEY, currentData);
    }

    const dataWithTimestamp = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    return true;
  } catch (error) {
    console.error('❌ Error al guardar datos offline:', error);
    return false;
  }
};

/**
 * ACTUALIZACIÓN SELECTIVA
 * Permite actualizar solo una sección (ej: 'projects') manteniendo el resto intacto.
 */
export const updateSpecificKey = (key: keyof OfflineData, newData: any): void => {
  try {
    const currentData = getOfflineData();
    const updatedData = {
      ...currentData,
      [key]: newData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    console.log(`💾 Respaldo local actualizado: [${key}]`);
  } catch (error) {
    console.error(`❌ Error actualizando backup local para ${key}:`, error);
  }
};

// ========================================
// FUNCIONES DE SINCRONIZACIÓN (NUEVAS)
// ========================================

/**
 * Verifica si hay elementos creados localmente esperando subir a la nube
 */
export const hasPendingChanges = (): boolean => {
  const data = getOfflineData();
  const check = (items: any[]) => items.some(item => item.id?.toString().startsWith('offline-') || item.id?.toString().startsWith('temp-'));

  return (
    check(data.experiences) ||
    check(data.projects) ||
    check(data.workPhilosophy) ||
    check(data.stats) ||
    check(data.technologies) ||
    data.skillCategories.some(cat => check(cat.skills))
  );
};

/**
 * Retorna un objeto con solo las colecciones que tienen cambios pendientes (IDs offline- o temp-)
 */
export const getPendingSyncData = (): Partial<OfflineData> => {
  const data = getOfflineData();
  const filterOffline = (items: any[]) => 
    items.filter(item => 
      item.id?.toString().startsWith('offline-') || 
      item.id?.toString().startsWith('temp-')
    );

  return {
    experiences: filterOffline(data.experiences),
    projects: filterOffline(data.projects),
    workPhilosophy: filterOffline(data.workPhilosophy),
    stats: filterOffline(data.stats),
    technologies: filterOffline(data.technologies),
    skillCategories: data.skillCategories.map(cat => ({
      ...cat,
      skills: filterOffline(cat.skills)
    })).filter(cat => cat.skills.length > 0)
  };
};

/**
 * Obtiene el conteo total de elementos pendientes de sincronizar
 */
export const getPendingChangesCount = (): number => {
  const pending = getPendingSyncData();
  let count = 0;
  
  count += (pending.experiences?.length || 0);
  count += (pending.projects?.length || 0);
  count += (pending.workPhilosophy?.length || 0);
  count += (pending.stats?.length || 0);
  count += (pending.technologies?.length || 0);
  
  pending.skillCategories?.forEach(cat => {
    count += cat.skills.length;
  });

  return count;
};

// ========================================
// UTILIDADES ADICIONALES
// ========================================

/**
 * Restaura el backup anterior
 */
export const restoreBackup = (): boolean => {
  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (!backup) return false;
    localStorage.setItem(STORAGE_KEY, backup);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Limpia todos los datos offline
 */
export const clearOfflineData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_KEY);
};

/**
 * Exporta los datos a un archivo JSON descargable
 */
export const exportOfflineData = (): void => {
  try {
    const data = getOfflineData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('❌ Error al exportar datos:', error);
  }
};

/**
 * Importa datos desde un archivo JSON
 */
export const importOfflineData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as OfflineData;
        const success = saveOfflineData(data);
        if (success) window.location.reload();
        resolve(success);
      } catch (error) {
        resolve(false);
      }
    };
    reader.readAsText(file);
  });
};