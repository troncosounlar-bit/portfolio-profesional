import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseSkills } from '../hooks/useSupabaseSkills';
import { TechBanner } from './TechBanner';

export const Skills = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { skillCategories, isLoading } = useSupabaseSkills();

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

  if (isLoading) {
    return (
      <section id="skills" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">{t('projects.loading')}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-gray-400 text-sm sm:text-base uppercase tracking-wider">
            {t('skills.subtitle')}
          </span>

          <h3 className="text-white mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {t('skills.title')}{' '}
            <span style={{ color: 'var(--accent-dynamic)', textShadow: `0 0 30px var(--accent-dynamic-glow)` }}>
              {t('skills.title.highlight')}
            </span>
          </h3>

          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--accent-dynamic)' }} />
        </motion.div>

        {/* SKILL CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 items-stretch">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.15 }}
              whileHover={{ scale: 1.04 }}
              className="relative group rounded-xl p-[2px] border-2 border-white/20 transition-all duration-150 flex flex-col"
            >
              {/* CORRECCIÓN: Quitamos el shadow de aquí para que no se vea doble */}
              <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150" />

              {/* CONTENEDOR INTERNO: Mantenemos tu sombra aquí, que es la que manda */}
              <div className="relative z-10 bg-black/60 rounded-xl p-6 pt-10 backdrop-blur-sm 
                  transition-all duration-150 group-hover:shadow-[0_0_20px_var(--accent-dynamic)] h-full flex flex-col">

                <div className="
                  absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2
                  rounded-full border-2 border-white/20 
                  bg-black text-white text-sm tracking-wide
                  shadow-[0_0_10px_var(--accent-dynamic)]
                  group-hover:shadow-[0_0_20px_var(--accent-dynamic)]
                  transition-all duration-150
                ">
                  {category.name}
                </div>

                <div className="space-y-6 mt-4 flex-grow">
                  {category.skills.map((skill: any, skillIndex: number) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300 text-sm">{skill.name}</span>
                        <span className="text-gray-400 text-sm">{skill.level}%</span>
                      </div>

                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isVisible ? { width: `${skill.level}%` } : {}}
                          transition={{
                            duration: 1,
                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                          }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: 'var(--accent-dynamic)',
                            boxShadow: `0 0 10px var(--accent-dynamic-glow)`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TECH BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h4 className="text-center font-semibold mb-6 tracking-wide"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'white', textShadow: '0 0 12px rgba(255,255,255,0.2)' }}>
            {t('skills.technologies.title')}
          </h4>

          <div className="w-16 h-[3px] mx-auto mb-12 rounded-full"
            style={{ backgroundColor: 'var(--accent-dynamic)', boxShadow: '0 0 12px var(--accent-dynamic-glow)' }} />

          <TechBanner />
        </motion.div>
      </div>
    </section>
  );
};