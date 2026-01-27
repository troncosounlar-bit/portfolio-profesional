import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Code2, Rocket, Users, Heart, Star, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseAbout } from '../hooks/useSupabaseAbout';

export const About = () => {
  const { t, language } = useLanguage(); // Extraemos language para el switch de contenido
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { aboutData, workPhilosophy, isLoading } = useSupabaseAbout();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Icon mapping
  const iconMap: Record<string, any> = {
    code: Code2,
    rocket: Rocket,
    users: Users,
    heart: Heart,
    star: Star,
    shield: Shield,
  };

  // Parse description into paragraphs - SOPORTE MULTIDIOMA
  const descriptionContent = language === 'es' 
    ? aboutData?.description 
    : (aboutData?.description_en || aboutData?.description);

  const paragraphs = descriptionContent?.split('\n\n').filter((p: string) => p.trim()) || [];

  if (isLoading) {
    return (
      <section
        id="about"
        ref={sectionRef}
        className="py-12 px-4 sm:px-6 lg:px-8 relative"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">Cargando...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">
            <span className="text-gray-400 text-sm sm:text-base uppercase tracking-wider">
              {t('about.subtitle')}
            </span>
          </h2>
          <h3
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            {t('about.title')}{' '}
            <span
              style={{
                color: 'var(--accent-dynamic)',
                textShadow: `0 0 30px var(--accent-dynamic-glow)`,
              }}
            >
              {t('about.title.highlight')}
            </span>
          </h3>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: 'var(--accent-dynamic)' }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-gray-300 leading-relaxed">
                  {t('about.p1')}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {t('about.p2')}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {t('about.p3')}
                </p>
              </>
            )}
          </motion.div>

          {/* Imagen profesional con hover glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            className="flex justify-center"
          >
            <div className="relative group rounded-xl overflow-hidden border-2 border-white/20 shadow-xl"
                 style={{ width: "fit-content", height: "fit-content" }}>
          
              {/* Glow */}
              <div
                className="
                  absolute inset-0 rounded-xl pointer-events-none
                  opacity-0 group-hover:opacity-100
                  transition-all duration-150
                  shadow-[0_0_20px_var(--accent-dynamic)]
                "
              />
          
              <img
                src={aboutData?.image_url}
                alt="Foto profesional"
                className="
                  w-[360px]
                  h-auto
                  rounded-xl
                  object-cover object-top
                "
              />
            </div>
          </motion.div>
        </div>

        {/* Cards debajo de la imagen - AJUSTE DE GRID PARA INGLÉS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6" // md:grid-cols-3 asegura las 3 columnas
        >
          {workPhilosophy.map((value, index: number) => {
            const Icon = iconMap[value.icon.toLowerCase()] || Code2;
            
            // Contenido dinámico según idioma
            const title = language === 'es' ? value.title : (value.title_en || value.title);
            const description = language === 'es' ? value.description : (value.description_en || value.description);

            return (
              <motion.div
                key={value.id || index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{
                  scale: 1.04,
                  transition: { duration: 0.18 },
                }}
                className="relative group rounded-xl p-[2px] border-2 border-white/20 transition-all duration-150 h-full flex flex-col"
              >
                {/* Glow */}
                <div
                  className="
                    absolute inset-0 rounded-xl pointer-events-none
                    opacity-0 group-hover:opacity-100
                    transition-all duration-150
                    shadow-[0_0_15px_var(--accent-dynamic)]
                  "
                />

                {/* Contenido */}
                <div
                  className="
                    relative z-10 bg-black/60 rounded-xl p-6 pt-10
                    backdrop-blur-sm transition-all duration-150
                    group-hover:shadow-[0_0_20px_var(--accent-dynamic)]
                    flex-1
                  "
                >
                  {/* Ícono */}
                  <div
                    className="
                      absolute -top-6 left-1/2 -translate-x-1/2
                      w-12 h-12 rounded-full
                      flex items-center justify-center
                      border-2 border-white/20 bg-black/70
                      shadow-[0_0_10px_var(--accent-dynamic)]
                      group-hover:shadow-[0_0_20px_var(--accent-dynamic)]
                      transition-all duration-150
                    "
                  >
                    <Icon size={22} className="text-[var(--accent-dynamic)]" />
                  </div>

                  {/* Título */}
                  <h4 className="text-white mb-2">{title}</h4>

                  {/* Descripción */}
                  <p className="text-gray-400 text-sm">{description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};