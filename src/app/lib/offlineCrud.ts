/**
 * CRUD OPERATIONS PARA MODO OFFLINE
 * * Maneja todas las operaciones CRUD cuando Supabase no está disponible.
 * Los cambios se guardan en localStorage y se pueden exportar/importar.
 */

import { getOfflineData, saveOfflineData, OfflineData } from './offlineStorage';
import { 
  Experience, 
  Project, 
  Stat, 
  Skill, 
  Technology, 
  WorkPhilosophy, 
  AboutData,
  HeroData,
  ContactSubmission,
  StyleSettings // Importado para evitar el uso de 'any'
} from './types';

/**
 * Genera un ID único para nuevos elementos
 */
const generateId = (): string => {
  return `offline-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Obtiene todos los datos offline actuales
 */
const getData = (): OfflineData => {
  const data = getOfflineData();
  if (!data) {
    throw new Error('No hay datos offline disponibles');
  }
  return data;
};

// ==================== EXPERIENCES ====================

export const saveExperienceOffline = (experience: Experience): boolean => {
  try {
    const data = getData();
    const existingIndex = data.experiences.findIndex(e => e.id === experience.id);
    
    if (existingIndex >= 0) {
      data.experiences[existingIndex] = experience;
    } else {
      const newExperience = { ...experience, id: experience.id || generateId() };
      data.experiences.push(newExperience);
    }
    
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando experiencia offline:', error);
    return false;
  }
};

export const deleteExperienceOffline = (id: string): boolean => {
  try {
    const data = getData();
    data.experiences = data.experiences.filter(e => e.id !== id);
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error eliminando experiencia offline:', error);
    return false;
  }
};

// ==================== PROJECTS ====================

export const saveProjectOffline = (project: Project): boolean => {
  try {
    const data = getData();
    const existingIndex = data.projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      data.projects[existingIndex] = project;
    } else {
      const newProject = { ...project, id: project.id || generateId() };
      data.projects.push(newProject);
    }
    
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando proyecto offline:', error);
    return false;
  }
};

export const deleteProjectOffline = (id: string): boolean => {
  try {
    const data = getData();
    data.projects = data.projects.filter(p => p.id !== id);
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error eliminando proyecto offline:', error);
    return false;
  }
};

// ==================== STATS ====================

export const saveStatOffline = (stat: Stat): boolean => {
  try {
    const data = getData();
    const existingIndex = data.stats.findIndex(s => s.id === stat.id);
    
    if (existingIndex >= 0) {
      data.stats[existingIndex] = stat;
    } else {
      const newStat = { ...stat, id: stat.id || generateId() };
      data.stats.push(newStat);
    }
    
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando estadística offline:', error);
    return false;
  }
};

// ==================== SKILLS ====================

export const saveSkillOffline = (skill: Skill): boolean => {
  try {
    const data = getData();
    const categoryIndex = data.skillCategories.findIndex(cat => cat.id === skill.category_id);
    
    if (categoryIndex < 0) {
      console.error('Categoría no encontrada');
      return false;
    }
    
    const category = data.skillCategories[categoryIndex];
    const existingIndex = category.skills.findIndex(s => s.id === skill.id);
    
    if (existingIndex >= 0) {
      category.skills[existingIndex] = skill;
    } else {
      const newSkill = { ...skill, id: skill.id || generateId() };
      category.skills.push(newSkill);
    }
    
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando habilidad offline:', error);
    return false;
  }
};

export const deleteSkillOffline = (id: string): boolean => {
  try {
    const data = getData();
    data.skillCategories.forEach(category => {
      category.skills = category.skills.filter(s => s.id !== id);
    });
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error eliminando habilidad offline:', error);
    return false;
  }
};

// ==================== TECHNOLOGIES ====================

export const saveTechnologyOffline = (technology: Technology): boolean => {
  try {
    const data = getData();
    const existingIndex = data.technologies.findIndex(t => t.id === technology.id);
    
    if (existingIndex >= 0) {
      data.technologies[existingIndex] = technology;
    } else {
      const newTech = { ...technology, id: technology.id || generateId() };
      data.technologies.push(newTech);
    }
    
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando tecnología offline:', error);
    return false;
  }
};

export const deleteTechnologyOffline = (id: string): boolean => {
  try {
    const data = getData();
    data.technologies = data.technologies.filter(t => t.id !== id);
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error eliminando tecnología offline:', error);
    return false;
  }
};

// ==================== WORK PHILOSOPHY ====================

export const savePhilosophyOffline = (philosophy: WorkPhilosophy): boolean => {
  try {
    const data = getData();
    const existingIndex = data.workPhilosophy.findIndex(p => p.id === philosophy.id);
    
    if (existingIndex >= 0) {
      data.workPhilosophy[existingIndex] = philosophy;
    } else {
      const newPhil = { ...philosophy, id: philosophy.id || generateId() };
      data.workPhilosophy.push(newPhil);
    }
    
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando filosofía offline:', error);
    return false;
  }
};

export const deletePhilosophyOffline = (id: string): boolean => {
  try {
    const data = getData();
    data.workPhilosophy = data.workPhilosophy.filter(p => p.id !== id);
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error eliminando filosofía offline:', error);
    return false;
  }
};

// ==================== ABOUT DATA ====================

export const saveAboutDataOffline = (aboutData: AboutData): boolean => {
  try {
    const data = getData();
    data.aboutData = aboutData;
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando datos about offline:', error);
    return false;
  }
};

// ==================== HERO DATA ====================

export const saveHeroDataOffline = (heroData: HeroData): boolean => {
  try {
    const data = getData();
    data.heroData = heroData;
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando datos hero offline:', error);
    return false;
  }
};

// ==================== STYLE SETTINGS ====================

export const saveStyleSettingsOffline = (styleSettings: StyleSettings): boolean => {
  try {
    const data = getData();
    data.styleSettings = styleSettings;
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error guardando configuración de estilo offline:', error);
    return false;
  }
};

// ==================== MESSAGES ====================

export const deleteMessageOffline = (id: string): boolean => {
  try {
    const data = getData();
    // CORRECCIÓN: Ahora usamos ContactSubmission para filtrar, eliminando el error 6133
    data.messages = data.messages.filter((m: ContactSubmission) => m.id !== id);
    return saveOfflineData(data);
  } catch (error) {
    console.error('Error eliminando mensaje offline:', error);
    return false;
  }
};

// ==================== HELPERS ====================

/**
 * Sincroniza datos locales con fallbackData inicial si no existen
 */
export const initializeOfflineData = (fallbackData: any): boolean => {
  try {
    const existingData = getOfflineData();
    if (!existingData) {
      return saveOfflineData({
        ...fallbackData,
        lastUpdated: new Date().toISOString(),
      });
    }
    return true;
  } catch (error) {
    console.error('Error inicializando datos offline:', error);
    return false;
  }
};

/**
 * Verifica si hay cambios pendientes de sincronizar
 */
export const hasPendingChanges = (): boolean => {
  const data = getOfflineData();
  if (!data) return false;
  
  const hasOfflineIds = (items: any[]): boolean => {
    return items.some(item => item.id?.toString().startsWith('offline-'));
  };
  
  return (
    hasOfflineIds(data.experiences) ||
    hasOfflineIds(data.projects) ||
    hasOfflineIds(data.stats) ||
    hasOfflineIds(data.technologies) ||
    hasOfflineIds(data.workPhilosophy) ||
    data.skillCategories.some(cat => hasOfflineIds(cat.skills))
  );
};

/**
 * Obtiene el número de cambios pendientes
 */
export const getPendingChangesCount = (): number => {
  const data = getOfflineData();
  if (!data) return 0;
  
  let count = 0;
  const countOfflineIds = (items: any[]): number => {
    return items.filter(item => item.id?.toString().startsWith('offline-')).length;
  };
  
  count += countOfflineIds(data.experiences);
  count += countOfflineIds(data.projects);
  count += countOfflineIds(data.stats);
  count += countOfflineIds(data.technologies);
  count += countOfflineIds(data.workPhilosophy);
  
  data.skillCategories.forEach(cat => {
    count += countOfflineIds(cat.skills);
  });
  
  return count;
};