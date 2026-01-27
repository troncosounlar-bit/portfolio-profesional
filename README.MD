# 🚀 Portfolio Profesional Full-Stack con Panel de Administración

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178c6.svg)
![Supabase](https://img.shields.io/badge/supabase-2.90.1-3ecf8e.svg)

> **Portfolio profesional dinámico con sistema de administración completo, soporte multi-idioma, autenticación segura y modo offline.**

---

## 📋 Descripción del Proyecto

Portfolio profesional de última generación construido con las tecnologías más modernas del ecosistema React. Este proyecto combina un **frontend público** espectacular con un **panel de administración completo** que permite gestionar todo el contenido sin necesidad de tocar código.

### ✨ Características Principales

#### 🎨 **Frontend Público**
- **Diseño moderno y responsive** con animaciones fluidas usando Motion (Framer Motion)
- **Secciones completas**: Hero, Experiencia, Proyectos, Estadísticas, Habilidades, Acerca de, Contacto
- **Partículas de fondo animadas** para un efecto visual impactante
- **Sistema multi-idioma** (Español/Inglés) con cambio dinámico
- **Modo offline** con datos de respaldo (fallback data)
- **Animaciones avanzadas** con detección de scroll y efectos hover
- **Sistema de colores dinámicos** que cambia aleatoriamente en cada visita

#### 🔐 **Panel de Administración**
- **Autenticación segura** con Supabase Auth
- **Autenticación offline** con sistema de respaldo basado en localStorage
- **Detección automática** de estado online/offline de la base de datos
- **9 secciones administrables**:
  - ⚙️ **Estilo**: Configuración de colores y estilos
  - 🏠 **Hero**: Datos principales, foto de perfil, enlaces sociales
  - 💼 **Experiencia**: Gestión de experiencias laborales y académicas
  - 📁 **Proyectos**: Administración de proyectos del portfolio
  - 📊 **Estadísticas**: Métricas y logros destacados
  - 💻 **Habilidades**: Skills organizadas por categorías
  - ⚡ **Tecnologías**: Herramientas y tecnologías usadas
  - 👤 **Acerca de**: Información personal y filosofía de trabajo
  - 📧 **Mensajes**: Visualización de mensajes de contacto

#### 💾 **Sistema de Persistencia**
- **Dual-Sync System**: Sincronización automática entre Supabase y localStorage
- **Backup automático** de datos en localStorage
- **Modo offline completo**: Edición y visualización sin conexión
- **Sincronización inteligente**: Los cambios se guardan localmente y se sincronizan cuando hay conexión

---

## 🛠️ Stack Tecnológico

### **Core**
- ⚛️ **React 18.3.1** - Biblioteca principal de UI
- 📘 **TypeScript 5.x** - Tipado estático y desarrollo type-safe
- ⚡ **Vite 6.3.5** - Build tool ultra-rápido

### **Styling**
- 🎨 **Tailwind CSS v4** - Framework CSS utility-first
- 💅 **CSS Modules** - Estilos personalizados
- 🎭 **Motion (Framer Motion) 12.23.24** - Animaciones avanzadas

### **Backend & Database**
- 🔥 **Supabase 2.90.1** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage (para imágenes)
  - Real-time subscriptions

### **UI Components**
- 🎯 **Radix UI** - Componentes accesibles y sin estilos
- 🔔 **Sonner** - Sistema de notificaciones toast
- 📊 **Recharts** - Gráficos y visualizaciones
- 🎪 **Lucide React** - Iconos modernos

### **State Management & Hooks**
- 🪝 **React Hooks** - useState, useEffect, useCallback, useMemo, useContext
- 🎣 **Custom Hooks** - Hooks personalizados para lógica reutilizable
- 📦 **Context API** - Para gestión de idioma

### **Forms & Validation**
- 📝 **React Hook Form 7.55.0** - Manejo de formularios
- ✅ **Input validation** - Validación de campos

### **Utilities**
- 🔧 **clsx & tailwind-merge** - Utilidades para clases CSS
- 📅 **date-fns** - Manipulación de fechas
- 🎨 **class-variance-authority** - Variantes de componentes

---

## 📁 Estructura del Proyecto

```
portfolio-profesional/
│
├── public/                          # Archivos estáticos
│   └── clear-cache.html            # Herramienta de limpieza de caché
│
├── src/
│   ├── app/
│   │   ├── components/             # Componentes de React
│   │   │   ├── admin/             # Componentes del panel admin
│   │   │   │   ├── sections/      # Secciones del dashboard
│   │   │   │   │   ├── AboutTab.tsx
│   │   │   │   │   ├── ContactTab.tsx
│   │   │   │   │   ├── ExperienceTab.tsx
│   │   │   │   │   ├── HeroTab.tsx
│   │   │   │   │   ├── ProjectsTab.tsx
│   │   │   │   │   ├── SkillsTab.tsx
│   │   │   │   │   ├── StatsTab.tsx
│   │   │   │   │   ├── StyleSection.tsx
│   │   │   │   │   └── TechnologiesTab.tsx
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   └── ChangePasswordModal.tsx
│   │   │   │
│   │   │   ├── ui/                # Componentes UI reutilizables
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   └── ... (40+ componentes)
│   │   │   │
│   │   │   ├── About.tsx          # Sección Acerca de
│   │   │   ├── AdminDashboard.tsx # Dashboard principal
│   │   │   ├── Contact.tsx        # Sección de contacto
│   │   │   ├── DevelopedBy.tsx    # Firma del desarrollador
│   │   │   ├── Experience.tsx     # Sección de experiencia
│   │   │   ├── FallbackIndicator.tsx # Indicador de modo offline
│   │   │   ├── Footer.tsx         # Pie de página
│   │   │   ├── Hero.tsx           # Sección hero principal
│   │   │   ├── LoadingScreen.tsx  # Pantalla de carga
│   │   │   ├── Navbar.tsx         # Barra de navegación
│   │   │   ├── ParticlesBackground.tsx # Fondo animado
│   │   │   ├── Projects.tsx       # Sección de proyectos
│   │   │   ├── Skills.tsx         # Sección de habilidades
│   │   │   ├── Stats.tsx          # Sección de estadísticas
│   │   │   ├── TechBanner.tsx     # Banner de tecnologías
│   │   │   └── VideoModal.tsx     # Modal de videos
│   │   │
│   │   ├── contexts/              # React Contexts
│   │   │   └── LanguageContext.tsx # Context de idioma
│   │   │
│   │   ├── hooks/                 # Custom Hooks
│   │   │   ├── useAdminAuth.ts    # Hook de autenticación admin
│   │   │   ├── useAdminData.ts    # Hook de datos del admin
│   │   │   ├── useSupabaseAbout.ts
│   │   │   ├── useSupabaseExperiences.ts
│   │   │   ├── useSupabaseHero.ts
│   │   │   ├── useSupabaseProjects.ts
│   │   │   ├── useSupabaseSkills.ts
│   │   │   ├── useSupabaseStats.ts
│   │   │   ├── useSupabaseTechnologies.ts
│   │   │   └── useSupabaseViews.ts
│   │   │
│   │   ├── lib/                   # Librerías y utilidades
│   │   │   ├── adminAuth.ts       # Lógica de autenticación
│   │   │   ├── fallbackData.ts    # Datos de respaldo offline
│   │   │   ├── offlineCrud.ts     # Operaciones CRUD offline
│   │   │   ├── offlineStorage.ts  # Sistema de storage offline
│   │   │   ├── secureAuth.ts      # Autenticación segura
│   │   │   └── supabaseClient.ts  # Cliente de Supabase
│   │   │
│   │   ├── locales/               # Traducciones
│   │   │   ├── en.ts              # Inglés
│   │   │   └── es.ts              # Español
│   │   │
│   │   ├── utils/                 # Utilidades
│   │   │   └── iconHelpers.ts     # Helper de iconos
│   │   │
│   │   └── App.tsx                # Componente principal
│   │
│   ├── styles/                    # Estilos globales
│   │   ├── fonts.css             # Fuentes
│   │   ├── globals.css           # Estilos globales
│   │   ├── index.css             # Index styles
│   │   ├── tailwind.css          # Config Tailwind
│   │   └── theme.css             # Variables de tema
│   │
│   ├── main.tsx                   # Entry point
│   └── vite.env.d.ts
│
├── .env.local                   
├── .gitignore                   
├── package-lock.json               
├── package.json                  # Dependencias
├── postcss.config.mjs            
├── README.MD                
├── tsconfig.json                 # Configuración de TypeScript
├── tsconfig.node.json
└── vite.config.ts                # Configuración de Vit
```

---

## 🎯 Funcionalidades Destacadas

### 1. **Sistema de Autenticación Dual**
```typescript
// Autenticación online con Supabase
const { user } = await supabase.auth.signInWithPassword({ email, password });

// Autenticación offline de respaldo
const isOfflineAuth = isOfflineAuthenticated();
```

### 2. **Detección Inteligente de Estado Online/Offline**
```typescript
const { error: healthError } = await supabase.from("hero_data").select("id").limit(1);
setIsSystemOnline(!healthError); // true si online, false si offline
```

### 3. **Sistema Dual-Sync**
```typescript
// Guardar en Supabase Y localStorage
if (isSystemOnline) await updateHeroData(data);
updateSpecificKey("heroData", data); // Backup local
```

### 4. **Multi-idioma con Context**
```typescript
const { t, language, toggleLanguage } = useLanguage();
<h1>{t('hero.title')}</h1>
```

### 5. **Animaciones con Motion**
```typescript
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

---

## 🗄️ Estructura de Base de Datos (Supabase)

### Tablas Principales

#### 1. **hero_data**
```sql
- id: uuid
- name: text
- title: text (multi-idioma JSON)
- description: text (multi-idioma JSON)
- profile_image_url: text
- social_links: jsonb
- created_at: timestamp
```

#### 2. **experiences**
```sql
- id: uuid
- type: text (work/education)
- title: text
- company: text
- period: text
- location: text
- description: text
- technologies: text[]
- image_url: text
- order_position: integer
```

#### 3. **projects**
```sql
- id: uuid
- title: text (multi-idioma JSON)
- description: text (multi-idioma JSON)
- image_url: text
- video_url: text
- github_url: text
- demo_url: text
- technologies: text[]
- featured: boolean
- order_position: integer
```

#### 4. **stats**
```sql
- id: uuid
- icon: text
- value: text
- label: text (multi-idioma JSON)
- order_position: integer
```

#### 5. **skill_categories**
```sql
- id: uuid
- name: text (multi-idioma JSON)
- order_position: integer
```

#### 6. **skills**
```sql
- id: uuid
- category_id: uuid (FK)
- name: text
- level: integer (0-100)
- order_position: integer
```

#### 7. **technologies**
```sql
- id: uuid
- name: text
- icon_url: text
- category: text
- order_position: integer
```

#### 8. **about_data**
```sql
- id: uuid
- description: text (multi-idioma JSON)
- image_url: text
- years_experience: integer
- projects_completed: integer
- technologies_used: integer
```

#### 9. **work_philosophy**
```sql
- id: uuid
- icon: text
- title: text (multi-idioma JSON)
- description: text (multi-idioma JSON)
- order_position: integer
```

#### 10. **contact_submissions**
```sql
- id: uuid
- name: text
- email: text
- message: text
- created_at: timestamp
- read: boolean
```

#### 11. **style_settings**
```sql
- id: uuid
- theme: text
- accent_colors: jsonb
- custom_css: text
```

#### 12. **page_views**
```sql
- id: uuid
- page: text
- views: integer
- last_updated: timestamp
```

---

## 🔐 Seguridad

### Características de Seguridad Implementadas

1. **Autenticación Robusta**
   - Supabase Auth con JWT tokens
   - Sesiones persistentes
   - Autenticación offline con hash bcrypt simulado

2. **Protección de Rutas**
   - Panel de administración protegido
   - Validación de sesión en cada operación

3. **Validación de Datos**
   - Validación en frontend con React Hook Form
   - Validación en backend con Supabase RLS (Row Level Security)

4. **Sanitización**
   - Prevención de XSS
   - Escape de HTML en inputs

5. **Rate Limiting**
   - Sistema de bloqueo tras 5 intentos fallidos de login
   - Bloqueo temporal de 5 minutos

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye el proyecto para producción
npm run preview      # Preview de la build de producción
```

---

## 🌐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Opcional: Para desarrollo
VITE_ENV=development
```

---

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 18+ 
- npm o pnpm
- Cuenta de Supabase (gratuita)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd portfolio-profesional
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar Supabase**
- Crear proyecto en [supabase.com](https://supabase.com)
- Crear las tablas usando el SQL proporcionado
- Copiar URL y Anon Key

4. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

---

## 🎨 Personalización

### Cambiar Colores
Edita `/src/app/App.tsx`:
```typescript
const accentColors = [
  { main: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' }, // Púrpura
  { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' }, // Naranja
  { main: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' }, // Verde
];
```

### Cambiar Textos
Edita los archivos de idioma:
- `/src/app/locales/es.ts` - Español
- `/src/app/locales/en.ts` - Inglés

### Cambiar Fuentes
Edita `/src/styles/fonts.css`

---

## 🧪 Testing

El proyecto está listo para agregar tests:
- Jest para unit tests
- React Testing Library para component tests
- Cypress/Playwright para E2E tests

---

## 📱 Responsive Design

El portfolio es completamente responsive:
- 📱 **Mobile**: < 640px
- 📱 **Tablet**: 640px - 1024px
- 💻 **Desktop**: > 1024px
- 🖥️ **Large Desktop**: > 1536px

---

## ⚡ Optimizaciones

### Performance
- ✅ Code splitting con Vite
- ✅ Lazy loading de componentes
- ✅ Imágenes optimizadas
- ✅ CSS minificado
- ✅ Tree shaking automático

### SEO
- ✅ Meta tags configurables
- ✅ Semantic HTML
- ✅ URLs amigables
- ✅ Sitemap ready

---

## 🤝 Contribución

Este es un proyecto personal, pero las sugerencias son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- Website: [tuportfolio.com](https://tuportfolio.com)
- LinkedIn: [tu-linkedin](https://linkedin.com/in/tu-perfil)
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

---

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Motion (Framer Motion)](https://motion.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:
- 📧 Email: tu-email@ejemplo.com
- 💬 Discussions: [GitHub Discussions](https://github.com/tu-usuario/tu-repo/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/tu-repo/issues)

---

<div align="center">

### ⭐ Si te gustó este proyecto, dale una estrella en GitHub!

**Hecho con ❤️ y ☕ por [Tu Nombre]**

</div>
