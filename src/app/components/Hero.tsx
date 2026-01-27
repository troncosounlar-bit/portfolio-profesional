import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseHero } from '../hooks/useSupabaseHero';

export const Hero = () => {
  const { t } = useLanguage();
  const { heroData, isLoading } = useSupabaseHero();
  const [displayedText, setDisplayedText] = useState('');
  const fullText = heroData?.title || t('hero.title');

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText(''); 
    
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [fullText]);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-gray-400">Cargando...</div>
      </section>
    );
  }

  // Definimos el email para usarlo en el enlace
  const userEmail = heroData?.email || 'pablotroncoso.jobs@gmail.com';
  // Esta URL abre directamente el redactor de Gmail en una pestaña nueva
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-4"
            >
              <span className="text-gray-400">{heroData?.greeting || t('hero.greeting')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-4"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                lineHeight: 1.1,
              }}
            >
              <span className="text-white">{heroData?.first_name || t('hero.name.first')} </span>
              <span
                className="inline-block"
                style={{
                  color: 'var(--accent-dynamic)',
                  textShadow: `0 0 40px var(--accent-dynamic-glow)`,
                }}
              >
                {heroData?.last_name || t('hero.name.last')}
              </span>
            </motion.h1>

            <div className="mb-8 h-12 sm:h-16 flex items-center justify-center lg:justify-start">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-300"
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                }}
              >
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ color: 'var(--accent-dynamic)' }}
                >
                  |
                </motion.span>
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-gray-400 mb-12 max-w-2xl mx-auto lg:mx-0"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
            >
              {heroData?.description || t('hero.description')}{" "}
              
              <motion.span
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-block" }}
              >
                🚀
              </motion.span>
            </motion.p>

            {/* Botones principales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
            >
              <motion.button
                onClick={scrollToProjects}
                className="px-8 py-4 rounded-lg text-white border border-white/10 transition-all duration-150"
                style={{
                  backgroundColor: 'var(--accent-dynamic)',
                  boxShadow: '0 0 0 var(--accent-dynamic-glow)',
                }}
                whileHover={{
                  scale: 1.04,
                  filter: 'brightness(1.1)',
                }}
              >
                {t('hero.btn.projects')}
              </motion.button>

              <motion.button
                onClick={scrollToContact}
                className="px-8 py-4 rounded-lg text-white border border-white/10 transition-all duration-150"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: 'var(--accent-dynamic)',
                }}
                whileHover={{
                  scale: 1.04,
                  backgroundColor: 'rgba(139, 92, 246, 0.15)', // Valor estático RGBA en lugar de var(--accent-dynamic-glow)
                }}
              >
                {t('hero.btn.contact')}
              </motion.button>
            </motion.div>

            {/* Social Links Actualizados */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="flex gap-4 mt-12 justify-center lg:justify-start"
            >
              {[
                { 
                  Icon: Github, 
                  href: heroData?.github_url || 'https://github.com', 
                  color: '#ffffff',
                  hoverBg: 'rgba(255, 255, 255, 0.1)',
                  label: 'Mira el código de mis proyectos' 
                },
                { 
                  Icon: Mail, 
                  href: gmailUrl, // Usamos la URL directa de Gmail
                  color: '#EA4335',
                  hoverBg: 'rgba(234, 67, 53, 0.15)',
                  label: 'Envíame un Gmail directo',
                },
                { 
                  Icon: Linkedin, 
                  href: heroData?.linkedin_url || 'https://www.linkedin.com/in/antonio-pablo-troncoso/', 
                  color: '#0A66C2',
                  hoverBg: 'rgba(10, 102, 194, 0.15)',
                  label: 'Conectemos en LinkedIn'
                },
              ].map(({ Icon, href, color, hoverBg, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  title={label}
                  target="_blank" // Ahora Gmail se abrirá en una pestaña nueva limpia
                  rel="noopener noreferrer"
                  className="group w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 transition-all duration-300"
                  style={{ backgroundColor: '#2a2a2a' }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: hoverBg,
                    borderColor: color,
                  }}
                >
                  <Icon 
                    size={22} 
                    style={{ color }} 
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:scale-110" 
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden"
              style={{
                boxShadow: `0 0 60px var(--accent-dynamic-glow)`,
                border: '3px solid',
                borderColor: 'var(--accent-dynamic)',
              }}
            >
              {heroData?.profile_image_url ? (
                <img
                  src={heroData.profile_image_url}
                  alt={`${heroData.first_name} ${heroData.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-8xl" style={{ color: 'var(--accent-dynamic)' }}>
                    {heroData?.first_name?.charAt(0) || 'P'}{heroData?.last_name?.charAt(0) || 'T'}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};