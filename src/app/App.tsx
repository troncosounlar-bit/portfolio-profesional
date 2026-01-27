import { useEffect, useState } from 'react';
import { Navbar } from "./components/Navbar";
import { Hero } from './components/Hero';
import { DevelopedBy } from './components/DevelopedBy'; 
import { Stats } from './components/Stats';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ParticlesBackground } from './components/ParticlesBackground';
import { AdminDashboard } from './components/AdminDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { FallbackIndicator } from './components/FallbackIndicator';
import { LanguageProvider } from './contexts/LanguageContext.tsx';

export default function App() {
  // ✅ showLoading ahora inicia en true para el splash screen inicial
  const [showLoading, setShowLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Splash Screen inicial: Quitamos el loading tras 2 segundos
    const splashTimer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    // 2. Colores de acento dinámicos
    const accentColors = [
      { main: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' }, // Violeta
      { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' }, // Ámbar
      { main: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' }, // Esmeralda
    ];
    const randomColor = accentColors[Math.floor(Math.random() * accentColors.length)];
    document.documentElement.style.setProperty('--accent-dynamic', randomColor.main);
    document.documentElement.style.setProperty('--accent-dynamic-glow', randomColor.glow);
    document.documentElement.classList.add('dark');

    // 3. Manejador global de errores de imágenes (Supabase/Externas)
    const handleImageError = (e: ErrorEvent) => {
      if (e.message && e.message.includes('Failed to fetch')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    window.addEventListener('error', handleImageError, true);
    
    return () => {
      window.removeEventListener('error', handleImageError, true);
      clearTimeout(splashTimer);
    };
  }, []);

  /**
   * Maneja la navegación fluida entre Portfolio y Admin
   */
  const navigateWithLoading = (toAdmin: boolean) => {
    setIsTransitioning(true);
    // Pequeño delay para que la animación de carga se vea natural
    setTimeout(() => {
      setIsAdmin(toAdmin);
      setIsTransitioning(false);
      window.scrollTo(0, 0); // Reset de scroll al navegar
    }, 800);
  };

  // Renderizado de estados de carga y transición
  if (showLoading || isTransitioning) {
    return <LoadingScreen />;
  }

  // Vista de Administrador
  if (isAdmin) {
    return (
      <LanguageProvider>
        <AdminDashboard onNavigateBack={() => navigateWithLoading(false)} />
      </LanguageProvider>
    );
  }

  // Vista del Portfolio Principal
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white antialiased overflow-x-hidden selection:bg-[var(--accent-dynamic)] selection:text-black">
        <ParticlesBackground />
        <FallbackIndicator />

        <div className="relative z-10">
          <Navbar onNavigateAdmin={() => navigateWithLoading(true)} />

          <main>
            {/* Introducción de alto impacto */}
            <Hero />
            
            {/* Componente de autoría con estilo neón */}
            <DevelopedBy /> 
            
            {/* Secciones de contenido */}
            <section id="experience">
              <Experience />
            </section>
            
            <section id="projects">
              <Projects />
            </section>
            
            <section id="stats">
              <Stats />
            </section>
            
            <section id="skills">
              <Skills />
            </section>
            
            <section id="about">
              <About />
            </section>
            
            <section id="contact">
              <Contact />
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
}