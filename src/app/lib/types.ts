// ========================================
// INTERFACES / TIPOS
// ========================================

// Configuración de Estilo
export interface AccentColor {
  id: string;
  name: string;
  main: string;
  glow: string;
}

export interface StyleSettings {
  particleCount: number;
  accentColors: AccentColor[];
}

// Hero Data
export interface HeroData {
  id?: string;
  greeting: string;
  greeting_en?: string;
  first_name: string;
  last_name: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  profile_image_url?: string;
  github_url?: string;
  linkedin_url?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Experience
export interface Experience {
  id?: string;
  type: 'work' | 'education';
  title: string;
  title_en?: string;
  company: string;
  company_en?: string;
  period: string;
  period_en?: string;
  location: string;
  location_en?: string;
  description: string;
  description_en?: string;
  technologies: string[];
  image_url?: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// Project
export interface Project {
  id?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  image_url: string;
  demo_url?: string;
  demo_video_url?: string;
  github_url?: string;
  stack: string[];
  order_position: number;
  is_featured?: boolean;
  project_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Stats
export interface Stat {
  id?: string;
  label: string;
  label_en?: string;
  value: string;
  value_en?: string;
  icon: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// Skill Category
export interface SkillCategory {
  id?: string;
  name: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// Skill
export interface Skill {
  id?: string;
  category_id: string;
  name: string;
  level: number;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// Technology
export interface Technology {
  id?: string;
  name: string;
  logo_url?: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// About Data
export interface AboutData {
  id?: string;
  description: string;
  description_en?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Work Philosophy
export interface WorkPhilosophy {
  id?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  icon: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

// Contact Submission
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
  is_read: boolean;
}

// Page View
export interface PageView {
  id: number;
  count: number;
}

// Alias para compatibilidad con código antiguo
export type { Project as ProjectOld };
