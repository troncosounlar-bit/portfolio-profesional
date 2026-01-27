import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseExperiences } from '../hooks/useSupabaseExperiences';

export const Experience = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { experiences, isLoading } = useSupabaseExperiences();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Lógica de ordenamiento: Trabajo primero, luego Educación. 
  // Dentro de cada grupo, del más reciente al más antiguo.
  const sortedExperiences = [...experiences].sort((a, b) => {
    // 1. Prioridad por tipo (work < education)
    if (a.type === 'work' && b.type === 'education') return -1;
    if (a.type === 'education' && b.type === 'work') return 1;

    // 2. Ordenar por año dentro del mismo tipo
    const getYear = (p: string) => {
      const years = p.match(/\d{4}/g);
      return years ? Math.max(...years.map(Number)) : 0;
    };

    return getYear(b.period) - getYear(a.period);
  });

  if (isLoading) {
    return (
      <section id="experience" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-gray-400">Cargando experiencias...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">
            <span className="text-gray-400 text-sm uppercase tracking-wider">
              {t('exp.subtitle')}
            </span>
          </h2>
          <h3 className="text-white mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {t('exp.title')}{' '}
            <span style={{ color: 'var(--accent-dynamic)', textShadow: `0 0 30px var(--accent-dynamic-glow)` }}>
              {t('exp.title.highlight')}
            </span>
          </h3>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--accent-dynamic)' }} />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 transform sm:-translate-x-1/2"
            style={{ backgroundColor: 'var(--accent-dynamic)', opacity: 0.3 }}
          />

          <div className="space-y-12">
            {sortedExperiences.map((exp, index) => {
              const isLeft = index % 2 === 0;
              const Icon = exp.type === 'work' ? Briefcase : GraduationCap;
              
              // Soporte para contenido multiidioma desde Supabase
              const title = language === 'en' && exp.title_en ? exp.title_en : exp.title;
              const description = language === 'en' && exp.description_en ? exp.description_en : exp.description;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative flex items-center ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'} flex-row`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 z-10">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center border-4 border-white/20 bg-black/70 shadow-[0_0_10px_var(--accent-dynamic)]"
                    >
                      <Icon size={20} className="text-[var(--accent-dynamic)]" />
                    </motion.div>
                  </div>

                  {/* CARD */}
                  <div className={`w-full sm:w-5/12 ml-20 sm:ml-0 ${isLeft ? 'sm:text-right sm:pr-16' : 'sm:pl-16'}`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
                      className="relative group rounded-xl p-[2px] border-2 border-white/20 transition-all duration-150"
                    >
                      <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 shadow-[0_0_15px_var(--accent-dynamic)] transition-all" />

                      <div className="relative z-10 bg-black/60 rounded-xl p-6 pt-10 backdrop-blur-sm group-hover:shadow-[0_0_20px_var(--accent-dynamic)]">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/20 bg-black/70 shadow-[0_0_10px_var(--accent-dynamic)]">
                          <Icon size={22} className="text-[var(--accent-dynamic)]" />
                        </div>

                        <div className="mb-3">
                          <span
                            className="text-sm px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: 'rgba(139, 92, 246, 0.1)',
                              color: 'var(--accent-dynamic)',
                              border: '1px solid var(--accent-dynamic)',
                            }}
                          >
                            {exp.period}
                          </span>
                        </div>

                        <h4 className="text-white mb-2">{title}</h4>
                        <p className="text-gray-400 text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-sm mb-4">📍 {exp.location}</p>

                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                          {description}
                        </p>

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className={`flex flex-wrap gap-2 ${isLeft ? 'sm:justify-end' : ''}`}>
                            {exp.technologies.map((tech: string, tIdx: number) => (
                              <span
                                key={tIdx}
                                className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* IMAGE */}
                  <div className="hidden sm:block sm:w-5/12 relative h-60 pointer-events-none">
                    <AnimatePresence>
                      {hoveredIndex === index && exp.image_url && (
                        <motion.div
                          key={`img-${exp.id}`}
                          initial={{ opacity: 0, x: isLeft ? 80 : -80 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: isLeft ? 80 : -80 }}
                          transition={{ duration: 0.35 }}
                          className={`absolute top-1/2 -translate-y-1/2 
                            ${isLeft ? 'translate-x-[180px]' : '-translate-x-[180px]'}
                          `}
                        >
                          <img
                            src={exp.image_url}
                            alt={title}
                            className="w-[500px] h-[320px] rounded-xl shadow-2xl
                                       object-contain bg-black/50 backdrop-blur-sm"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};