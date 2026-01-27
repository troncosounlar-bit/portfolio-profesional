/**
 * DATOS DE FALLBACK PARA CUANDO SUPABASE NO ESTÉ DISPONIBLE
 * * Este archivo contiene datos por defecto que se mostrarán automáticamente
 * cuando Supabase esté pausado o no disponible, asegurando que el portfolio
 * siempre se vea profesional sin importar el estado de la base de datos.
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
  Technology 
} from './types';

// ========================================
// HELPER: Aplicar idioma a datos
// ========================================
export const applyLanguageToData = <T extends Record<string, any>>(
  data: T,
  language: 'es' | 'en'
): T => {
  if (language === 'es') return data;

  // Creamos una copia para no mutar el original
  const translated = { ...data };

  // Mapear campos _en a sus versiones sin sufijo
  Object.keys(data).forEach(key => {
    if (key.endsWith('_en')) {
      const baseKey = key.replace('_en', '');
      // Si el campo traducido tiene contenido, sobreescribimos el base
      if (data[key]) {
        (translated as any)[baseKey] = data[key];
      }
    }
  });

  return translated;
};

export const applyLanguageToArray = <T extends Record<string, any>>(
  array: T[],
  language: 'es' | 'en'
): T[] => {
  return array.map(item => applyLanguageToData(item, language));
};

// ========================================
// HERO DATA
// ========================================
export const fallbackHeroData: HeroData = {
  id: 'fallback-hero',
  greeting: '¡Hola! Soy',
  greeting_en: 'Hi! I am',
  first_name: 'Pablo',
  last_name: 'Troncoso',
  title: 'Desarrollador Full Stack',
  title_en: 'Full Stack Developer',
  description: 'Enfocado en construir interfaces modernas y soluciones escalables con React, Next.js y Node.js. En el último tiempo he orientado mi trabajo hacia el desarrollo frontend y las aplicaciones móviles, donde realmente me siento en mi mejor versión. Me apasiona optimizar cada detalle para lograr el mejor rendimiento y una experiencia de usuario impecable.',
  description_en: 'Focused on building modern interfaces and scalable solutions with React, Next.js and Node.js. Lately I have oriented my work towards frontend development and mobile applications, where I really feel at my best. I am passionate about optimizing every detail to achieve the best performance and an impeccable user experience.',
  profile_image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1768846731/Sin_t%C3%ADtulo_jvxk4e.png',
  github_url: 'https://github.com/troncosounlar-bit',
  linkedin_url: 'https://www.linkedin.com/in/antonio-pablo-troncoso/',
  email: 'pablotroncoso.jobs@gmail.com',
};

// ========================================
// ABOUT DATA
// ========================================
export const fallbackAboutData: AboutData = {
  id: 'fallback-about',
  description: `Desarrollador web fullstack especializado en la creación de interfaces modernas y soluciones escalables con React, Next.js y Node.js. Experiencia en proyectos reales con Ultrix Labs, desde el diseño UI hasta la integración backend con Appwrite y APIs externas. Apasionado por la optimización de rendimiento, la arquitectura modular y el aprendizaje continuo. Enfocado en la mejora constante de la experiencia de usuario y la eficiencia del producto. He trabajado en el desarrollo de aplicaciones profesionales como CRM, Invoice y plataformas bancarias, además de crear Festup App, una aplicación móvil con Adalo que incluye gestión de eventos y pagos con Mercado Pago.`,
  description_en: `Fullstack web developer specialized in creating modern interfaces and scalable solutions with React, Next.js and Node.js. Experience in real projects with Ultrix Labs, from UI design to backend integration with Appwrite and external APIs. Passionate about performance optimization, modular architecture and continuous learning. Focused on constantly improving user experience and product efficiency. I have worked on the development of professional applications such as CRM, Invoice and banking platforms, in addition to creating Festup App, a mobile application with Adalo that includes event management and payments with Mercado Pago.`,
  image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1768847327/IMG-20250923-WA0005_b7mkpj.png',
};

// ========================================
// WORK PHILOSOPHY
// ========================================
export const fallbackWorkPhilosophy: WorkPhilosophy[] = [
  {
    id: 'fallback-philosophy-1',
    title: 'Código Limpio',
    title_en: 'Clean Code',
    description: 'Escribo código mantenible, escalable y siguiendo las mejores prácticas.',
    description_en: 'I write maintainable, scalable code following best practices.',
    icon: 'Code2',
    order_position: 1,
  },
  {
    id: 'fallback-philosophy-2',
    title: 'Aprendizaje Continuo',
    title_en: 'Continuous Learning',
    description: 'La tecnología evoluciona rápidamente. Me mantengo actualizado con las últimas tendencias.',
    description_en: 'Technology evolves rapidly. I stay updated with the latest trends.',
    icon: 'BookOpen',
    order_position: 2,
  },
  {
    id: 'fallback-philosophy-3',
    title: 'Trabajo en Equipo',
    title_en: 'Teamwork',
    description: 'Colaboro efectivamente con diseñadores, desarrolladores y stakeholders.',
    description_en: 'I collaborate effectively with designers, developers and stakeholders.',
    icon: 'Users',
    order_position: 3,
  },
  {
    id: 'fallback-philosophy-4',
    title: 'Atención al Detalle',
    title_en: 'Attention to Detail',
    description: 'Los pequeños detalles marcan la diferencia en la experiencia del usuario.',
    description_en: 'Small details make the difference in user experience.',
    icon: 'Eye',
    order_position: 4,
  },
];

// ========================================
// EXPERIENCES
// ========================================
export const fallbackExperiences: Experience[] = [
  {
    id: 'fallback-exp-1',
    type: 'work',
    title: 'Docente',
    title_en: 'Instructor',
    company: 'FICDE',
    company_en: 'FICDE',
    period: 'Marzo 2025 - Actualidad',
    period_en: 'March 2025 - Present',
    location: '📍Remoto',
    location_en: '📍Remote',
    description: 'Dictado de clases sobre desarrollo web y fundamentos de JavaScript. Apoyo en la resolución de proyectos y prácticas de estudiantes.',
    description_en: 'Teaching web development and JavaScript fundamentals. Supporting students in project resolution and practical assignments.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Git', 'SQL'],
    image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1768849101/Screenshot_20260119_155334_Chrome_padjo4.jpg',
    order_position: 1,
  },
  {
    id: 'fallback-exp-2',
    type: 'work',
    title: 'Freelancer Fullstack',
    title_en: 'Fullstack Freelancer',
    company: 'Ultrix Labs LLC',
    company_en: 'Ultrix Labs LLC',
    period: 'Enero 2024 - Actualidad',
    period_en: 'January 2024 - Present',
    location: '📍 Remoto',
    location_en: '📍 Remote',
    description: 'Diseño, desarrollo e implementación de aplicaciones web profesionales utilizando Next.js 14, Tailwind CSS, TypeScript, Node.js y Appwrite.',
    description_en: 'Design, development and implementation of professional web applications using Next.js 14, Tailwind CSS, TypeScript, Node.js and Appwrite.',
    technologies: ['React', 'JavaScript', 'Next.js', 'TypeScript', 'Appwrite', 'Tailwind', 'Node.js', 'Adalo'],
    image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1768846914/Ultrix_jeoyf5.jpg',
    order_position: 2,
  },
  {
    id: 'fallback-exp-3',
    type: 'work',
    title: 'Ayudante Co-Docente',
    title_en: 'Teaching Assistant',
    company: 'Digital House',
    company_en: 'Digital House',
    period: 'Julio 2023 - Mayo 2024',
    period_en: 'July 2023 - May 2024',
    location: '📍 Remoto',
    location_en: '📍 Remote',
    description: 'Tutorías personalizadas a estudiantes del curso Fullstack Web Developer.',
    description_en: 'Personalized tutoring for students in the Fullstack Web Developer course.',
    technologies: ['JavaScript','HTML','CSS','React','Node.js','Express','MySQL'],
    image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1768847140/1694672460390_wf5m1y.jpg',
    order_position: 3,
  }
];

// ========================================
// PROJECTS
// ========================================
export const fallbackProjects: Project[] = [
  {
    id: 'fallback-project-1',
    title: 'VectorLab — Procesador Algorítmico de Vectores',
    title_en: 'VectorLab — Algorithmic Vector Processor',
    description: 'Aplicación interactiva para visualizar y entender estructuras algorítmicas clásicas como FOR, IF, WHILE, DO-WHILE y vectores.',
    description_en: 'Interactive application to visualize and understand classic algorithmic structures such as FOR, IF, WHILE, DO-WHILE and vectors.',
    image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1767583222/1765342566696-vhj3h5_oj9oul.jpg',
    demo_url: 'https://res.cloudinary.com/dxwjokjqb/video/upload/v1765428398/CloudiFInal_to0vtn.mp4',
    demo_video_url: 'https://res.cloudinary.com/dxwjokjqb/video/upload/v1765428398/CloudiFInal_to0vtn.mp4',
    github_url: 'https://github.com/troncosounlar-bit/VectorsLabs',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'shadcn/UI'],
    order_position: 1,
    is_featured: true,
  },
  {
    id: 'fallback-project-2',
    title: 'Pro-Tasker — Enterprise Task & Talent Manager',
    title_en: 'Pro-Tasker — Enterprise Task & Talent Manager',
    description: 'Plataforma profesional de gestión de talento y monitoreo de tareas en tiempo real.',
    description_en: 'Professional platform for talent management and real-time task monitoring.',
    image_url: 'https://res.cloudinary.com/dxwjokjqb/image/upload/v1768849586/Gemini_Generated_Image_futjnzfutjnzfutj_r7csmx.png',
    demo_url: 'https://res.cloudinary.com/dxwjokjqb/video/upload/v1768852881/Pro-Tasker_zodzio.mp4',
    demo_video_url: 'https://res.cloudinary.com/dxwjokjqb/video/upload/v1768852881/Pro-Tasker_zodzio.mp4',
    github_url: 'https://github.com/tu-usuario/pro-tasker',
    stack: ['React', 'Supabase', 'Chart.js', 'Tailwind', 'Webpack 5'],
    order_position: 2,
    is_featured: true
  },
  {
    id: 'fallback-project-3',
    title: 'Task Management App',
    title_en: 'Task Management App',
    description: 'Aplicación de gestión de tareas con colaboración en tiempo real, notificaciones y reportes.',
    description_en: 'Task management application with real-time collaboration, notifications and reports.',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    demo_url: '#',
    github_url: 'https://github.com',
    stack: ['React', 'Firebase', 'Material-UI'],
    order_position: 3,
    is_featured: false,
  },
];

// ========================================
// SKILLS, STATS & TECHNOLOGIES
// ========================================
export const fallbackSkillCategories: Array<SkillCategory & { skills: Skill[] }> = [
  {
    id: 'fallback-cat-1',
    name: 'Frontend',
    order_position: 1,
    skills: [
      { id: 'fallback-skill-1', category_id: 'fallback-cat-1', name: 'React', level: 90, order_position: 1 },
      { id: 'fallback-skill-2', category_id: 'fallback-cat-1', name: 'TypeScript', level: 85, order_position: 2 },
      { id: 'fallback-skill-3', category_id: 'fallback-cat-1', name: 'Tailwind CSS', level: 88, order_position: 3 }
    ],
  },
  {
    id: 'fallback-cat-2',
    name: 'Backend',
    order_position: 2,
    skills: [
      { id: 'fallback-skill-5', category_id: 'fallback-cat-2', name: 'Node.js', level: 85, order_position: 1 },
      { id: 'fallback-skill-6', category_id: 'fallback-cat-2', name: 'PostgreSQL', level: 75, order_position: 2 }
    ],
  }
];

export const fallbackStats: Stat[] = [
  { id: 'fallback-stat-1', label: 'Años de Experiencia', label_en: 'Years of Experience', value: '3+', value_en: '3+', icon: 'Calendar', order_position: 1 },
  { id: 'fallback-stat-2', label: 'Proyectos Completados', label_en: 'Completed Projects', value: '15+', value_en: '15+', icon: 'CheckCircle', order_position: 2 }
];

export const fallbackTechnologies: Technology[] = [
  { id: 'fallback-tech-1', name: 'React', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', order_position: 1 },
  { id: 'fallback-tech-2', name: 'TypeScript', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', order_position: 2 }
];

// ========================================
// HELPER: Detectar si Supabase está disponible
// ========================================
export const isSupabaseAvailable = async (): Promise<boolean> => {
  try {
    const { supabase } = await import('./client');
    const { error } = await supabase.from('hero_data').select('id').limit(1);
    if (error) return false;
    return true;
  } catch (error) {
    return false;
  }
};

// ========================================
// EXPORTACIÓN CENTRAL FALLBACK DATA
// ========================================
export const fallbackData = {
  styleSettings: {
    particleCount: 70,
    accentColors: [
      { id: 'blue', name: 'Ocean', main: '#3b82f6', glow: 'rgba(59, 130, 246, 0.5)' }
    ]
  },
  heroData: fallbackHeroData,
  aboutData: fallbackAboutData,
  projects: fallbackProjects,
  experiences: fallbackExperiences,
  workPhilosophy: fallbackWorkPhilosophy,
  skillCategories: fallbackSkillCategories,
  stats: fallbackStats,
  technologies: fallbackTechnologies,
  messages: [],
  pageViews: 1000
};