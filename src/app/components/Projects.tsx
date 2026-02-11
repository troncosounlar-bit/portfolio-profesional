import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Play, ChevronDown, ChevronUp, Loader2, Filter } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { useSupabaseProjects } from '../hooks/useSupabaseProjects';
import { ImageWithFallback } from "./ui/ImageWithFallback";
import { useLanguage } from '../contexts/LanguageContext';
import type { Project } from '../lib/types';

export const Projects = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(3);
  
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const { projects, isLoading } = useSupabaseProjects();

  useEffect(() => {
    const currentRef = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString.replace(/-/g, '\/'));
    if (isNaN(date.getTime())) return "";
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const displayProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => {
      switch (sortBy) {
        case 'az':
          return (a.title || '').localeCompare(b.title || '');
        case 'za':
          return (b.title || '').localeCompare(a.title || '');
        case 'newest':
          return new Date(b.project_date || 0).getTime() - new Date(a.project_date || 0).getTime();
        case 'oldest':
          return new Date(a.project_date || 0).getTime() - new Date(b.project_date || 0).getTime();
        default:
          return 0;
      }
    });
    return sorted.slice(0, visibleLimit);
  }, [projects, sortBy, visibleLimit]);

  const isShowMore = visibleLimit < projects.length;

  const toggleProjects = () => {
    if (isShowMore) {
      setVisibleLimit(prev => prev + 3);
    } else {
      setVisibleLimit(3);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDemoClick = (project: Project, e: React.MouseEvent) => {
    e.preventDefault();
    if (project.demo_video_url) {
      setVideoModal({ isOpen: true, url: project.demo_video_url, title: project.title });
    } else if (project.demo_url) {
      window.open(project.demo_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="mb-4">
            <span className="text-gray-400 text-sm uppercase tracking-wider">
              {t('projects.subtitle')}
            </span>
          </h2>
          <h3 className="text-white mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {t('projects.title')}{' '}
            <span style={{ 
              color: 'var(--accent-dynamic)', 
              textShadow: `0 0 30px var(--accent-dynamic-glow)` 
            }}>
              {t('projects.title.highlight')}
            </span>
          </h3>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--accent-dynamic)' }} />
        </motion.div>

        <div className="flex justify-end mb-10">
          <div className="relative group min-w-[240px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-20">
              <Filter size={16} className="text-[var(--accent-dynamic)]" />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-widest rounded-full border border-white/10 pl-11 pr-12 py-3.5 outline-none focus:border-[var(--accent-dynamic)] focus:ring-2 focus:ring-[var(--accent-dynamic)]/20 transition-all appearance-none cursor-pointer backdrop-blur-xl shadow-2xl relative z-10"
            >
              <option value="newest" className="bg-[#0f0f0f] text-white">📅 RECIENTES PRIMERO</option>
              <option value="oldest" className="bg-[#0f0f0f] text-white">📅 ANTIGUOS PRIMERO</option>
              <option value="az" className="bg-[#0f0f0f] text-white">🔤 NOMBRE (A-Z)</option>
              <option value="za" className="bg-[#0f0f0f] text-white">🔤 NOMBRE (Z-A)</option>
            </select>

            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none z-20 text-[var(--accent-dynamic)]">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {isLoading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[var(--accent-dynamic)] animate-spin mb-4" />
            <p className="text-gray-400 animate-pulse">{t('loading.projects') || 'Cargando proyectos...'}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {displayProjects.map((project, index) => (
              <motion.div
                key={project.id || `project-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.04 }}
                // AGREGADO: h-full para ocupar todo el alto del grid
                className="relative group rounded-xl p-[2px] border-2 border-white/20 transition-all duration-150 h-full"
              >
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_18px_var(--accent-dynamic)]" />

                {/* AGREGADO: h-full aquí también */}
                <div className="relative z-10 bg-black/60 rounded-xl backdrop-blur-sm overflow-hidden min-h-[540px] flex flex-col h-full">
                  
                  <div className="px-6 py-4 flex justify-center border-b border-white/5 bg-white/[0.02]">
                    <span 
                      className="text-[12.5px] font-bold uppercase tracking-[0.15em] transition-all duration-300 group-hover:scale-105"
                      style={{ 
                        color: 'var(--accent-dynamic)',
                        textShadow: `0 0 10px var(--accent-dynamic-glow)`
                      }}
                    >
                      {formatDate(project.project_date || '')}
                    </span>
                  </div>

                  <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="p-7 flex flex-col flex-grow">
                    <h4 className="text-xl text-white mb-3 group-hover:text-[var(--accent-dynamic)] transition-colors">
                      {project.title}
                    </h4>
                    
                    <p className="text-gray-400 text-sm mb-5 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.stack?.map((tech, techIndex) => (
                        <span 
                          key={`${project.id}-${techIndex}`} 
                          className="text-[10px] px-2.5 py-1 rounded bg-white/5 text-gray-300 border border-white/10 uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-6 mt-auto pt-4 border-t border-white/5">
                      <motion.a 
                        href="#" 
                        onClick={(e) => handleDemoClick(project, e)}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                      >
                        {project.demo_video_url ? <Play size={14} className="text-[var(--accent-dynamic)]" /> : <ExternalLink size={14} className="text-[var(--accent-dynamic)]" />}
                        <span className="uppercase tracking-widest">{t('projects.btn.demo')}</span>
                      </motion.a>
                      
                      {project.github_url && (
                        <motion.a 
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                        >
                          <Github size={14} className="text-[var(--accent-dynamic)]" />
                          <span className="uppercase tracking-widest">{t('projects.btn.code')}</span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {projects.length > 3 && (
          <motion.div className="text-center mt-16">
            <motion.button
              onClick={toggleProjects}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-full border-2 text-white transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: 'var(--accent-dynamic)' }}
            >
              <span className="font-bold uppercase tracking-widest text-xs">
                {isShowMore ? t('projects.btn.viewall') : t('projects.btn.showless') || "Mostrar Menos"}
              </span>
              <motion.div animate={{ y: isShowMore ? [0, 4, 0] : 0 }} transition={{ repeat: Infinity, duration: 1.5 }}>
                {isShowMore ? <ChevronDown size={20} className="text-[var(--accent-dynamic)]" /> : <ChevronUp size={20} className="text-[var(--accent-dynamic)]" />}
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </div>

      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, url: '', title: '' })}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </section>
  );
};