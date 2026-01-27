import { supabase } from './client';
import type { 
  Project, 
  HeroData, 
  Experience, 
  StyleSettings, 
  Stat, 
  Skill, 
  SkillCategory, 
  Technology, 
  AboutData, 
  WorkPhilosophy, 
  ContactSubmission 
} from './types';

// ========================================
// STORAGE (IMÁGENES Y VIDEOS)
// ========================================

export async function uploadImage(
  file: File,
  bucket: 'avatars' | 'experiences' | 'projects' | 'about',
  path?: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function uploadVideo(
  file: File,
  bucket: 'projects' | 'about',
  path?: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicData.publicUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

export async function deleteImage(
  url: string,
  bucket: 'avatars' | 'experiences' | 'projects' | 'about'
): Promise<void> {
  try {
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) return;
    const filePath = urlParts[1];
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// ========================================
// BASE DE DATOS: SETTINGS & HERO
// ========================================

export async function getStyleSettings(): Promise<StyleSettings | null> {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('setting_value')
    .eq('setting_key', 'style_settings')
    .single();
  if (error) return null;
  return data?.setting_value as StyleSettings;
}

export async function updateStyleSettings(settings: StyleSettings): Promise<void> {
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ setting_key: 'style_settings', setting_value: settings });
  if (error) throw error;
}

export async function getHeroData(): Promise<HeroData | null> {
  const { data, error } = await supabase.from('hero_data').select('*').limit(1).single();
  if (error) return null;
  return data;
}

export async function updateHeroData(heroData: Partial<HeroData>): Promise<void> {
  const { data: existing } = await supabase.from('hero_data').select('id').limit(1).single();
  if (existing) {
    const { error } = await supabase.from('hero_data').update(heroData).eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('hero_data').insert([heroData]);
    if (error) throw error;
  }
}

// ========================================
// BASE DE DATOS: EXPERIENCIAS & PROYECTOS
// ========================================

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('order_position', { ascending: true });
  
  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
  return data || [];
}

export async function createExperience(experience: Omit<Experience, 'id'>): Promise<Experience> {
  const { data, error } = await supabase.from('experiences').insert([experience]).select().single();
  if (error) throw error;
  return data;
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<void> {
  const { error } = await supabase.from('experiences').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from('experiences').delete().eq('id', id);
  if (error) throw error;
}

/**
 * OPTIMIZADO: Obtiene proyectos con mapeo de campos para seguridad de tipos
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) throw error;

    // MAPEADOR: Asegura que el frontend siempre reciba la estructura correcta
    return (data || []).map(project => ({
      ...project,
      // Forzamos que stack sea array para evitar que .map() falle en el componente
      stack: Array.isArray(project.stack) ? project.stack : [],
      // Aseguramos que si no hay video, sea null o undefined
      demo_video_url: project.demo_video_url || null,
    })) as Project[];
  } catch (error) {
    console.error('Error in getProjects service:', error);
    // Devolvemos array vacío para disparar el fallback del hook
    return [];
  }
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const { data, error } = await supabase.from('projects').insert([project]).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const { error } = await supabase.from('projects').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

// ========================================
// BASE DE DATOS: STATS, SKILLS & TECH
// ========================================

export async function getStats(): Promise<Stat[]> {
  const { data, error } = await supabase.from('stats').select('*').order('order_position', { ascending: true });
  return error ? [] : data || [];
}

export async function updateStat(id: string, updates: Partial<Stat>): Promise<void> {
  const { error } = await supabase.from('stats').update(updates).eq('id', id);
  if (error) throw error;
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const { data, error } = await supabase.from('skill_categories').select('*').order('order_position', { ascending: true });
  return error ? [] : data || [];
}

export async function getSkillsByCategory(categoryId: string): Promise<Skill[]> {
  const { data, error } = await supabase.from('skills').select('*').eq('category_id', categoryId).order('order_position', { ascending: true });
  return error ? [] : data || [];
}

export async function getAllSkillsWithCategories(): Promise<Array<SkillCategory & { skills: Skill[] }>> {
  const categories = await getSkillCategories();
  return await Promise.all(
    categories.map(async (category) => ({
      ...category,
      skills: await getSkillsByCategory(category.id!)
    }))
  );
}

export async function createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  const { data, error } = await supabase.from('skills').insert([skill]).select().single();
  if (error) throw error;
  return data;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<void> {
  const { error } = await supabase.from('skills').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

export async function getTechnologies(): Promise<Technology[]> {
  const { data, error } = await supabase.from('technologies').select('*').order('order_position', { ascending: true });
  return error ? [] : data || [];
}

export async function createTechnology(technology: Omit<Technology, 'id'>): Promise<Technology> {
  const { data, error } = await supabase.from('technologies').insert([technology]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTechnology(id: string, updates: Partial<Technology>): Promise<void> {
  const { error } = await supabase.from('technologies').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteTechnology(id: string): Promise<void> {
  const { error } = await supabase.from('technologies').delete().eq('id', id);
  if (error) throw error;
}

// ========================================
// BASE DE DATOS: ABOUT & PHILOSOPHY
// ========================================

export async function getAboutData(): Promise<AboutData | null> {
  const { data, error } = await supabase.from('about_data').select('*').limit(1).single();
  if (error) return null;
  return data;
}

export async function updateAboutData(aboutData: Partial<AboutData>): Promise<void> {
  const { data: existing } = await supabase.from('about_data').select('id').limit(1).single();
  if (existing) {
    const { error } = await supabase.from('about_data').update(aboutData).eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('about_data').insert([aboutData]);
    if (error) throw error;
  }
}

export async function getWorkPhilosophy(): Promise<WorkPhilosophy[]> {
  const { data, error } = await supabase.from('work_philosophy').select('*').order('order_position', { ascending: true });
  return error ? [] : data || [];
}

export async function createWorkPhilosophy(philosophy: Omit<WorkPhilosophy, 'id'>): Promise<WorkPhilosophy> {
  const { data, error } = await supabase.from('work_philosophy').insert([philosophy]).select().single();
  if (error) throw error;
  return data;
}

export async function updateWorkPhilosophy(id: string, updates: Partial<WorkPhilosophy>): Promise<void> {
  const { error } = await supabase.from('work_philosophy').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteWorkPhilosophy(id: string): Promise<void> {
  const { error } = await supabase.from('work_philosophy').delete().eq('id', id);
  if (error) throw error;
}

// ========================================
// CONTACTO & VISTAS
// ========================================

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
  return error ? [] : data || [];
}

export async function deleteContactSubmission(id: string): Promise<void> {
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
  if (error) throw error;
}

export async function getPageViewsCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('count')
      .eq('id', 1)
      .single();

    if (error) return 0;
    return data?.count || 0;
  } catch (error) {
    return 0;
  }
}

export async function updateContactSubmission(
  id: string, 
  updates: Partial<ContactSubmission>
): Promise<void> {
  const { error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
}