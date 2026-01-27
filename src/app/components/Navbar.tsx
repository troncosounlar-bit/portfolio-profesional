import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onNavigateAdmin?: () => void;
}

export const Navbar = ({ onNavigateAdmin }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: t('nav.about'), id: 'about' },
    { name: t('nav.experience'), id: 'experience' },
    { name: t('nav.skills'), id: 'skills' },
    { name: t('nav.projects'), id: 'projects' },
    { name: t('nav.contact'), id: 'contact' },
  ];

  const navigateToAdmin = () => {
    if (onNavigateAdmin) {
      onNavigateAdmin();
    } else {
      window.location.href = '/admin';
    }
  };

  // ✅ NUEVA LÓGICA: Evita saltos de scroll al cambiar idioma
  const toggleLanguage = () => {
    // 1. Identificamos qué sección está viendo el usuario actualmente
    const sections = ['experience', 'projects', 'stats', 'skills', 'about', 'contact'];
    let currentSectionId = '';

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Si la sección ocupa la parte superior/media de la pantalla
        if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
          currentSectionId = id;
          break;
        }
      }
    }

    // 2. Cambiamos el idioma
    setLanguage(language === 'es' ? 'en' : 'es');

    // 3. Si detectamos una sección activa, re-anclamos la vista inmediatamente
    if (currentSectionId) {
      // Usamos requestAnimationFrame para esperar a que el DOM procese el cambio de texto
      requestAnimationFrame(() => {
        const element = document.getElementById(currentSectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left side: Admin Button */}
          <div className="hidden md:flex items-center gap-4 absolute left-4">
            <motion.button
              onClick={navigateToAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:border-white/20 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield size={18} style={{ color: 'var(--accent-dynamic)' }} />
              <span className="text-sm">{t('nav.admin')}</span>
            </motion.button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 mx-auto">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => scrollToSection(link.id)}
                className="relative text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="relative z-10">{link.name}</span>
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300"
                  style={{ backgroundColor: 'var(--accent-dynamic)' }}
                />
              </motion.button>
            ))}
          </div>

          {/* Right side: Language Switch */}
          <div className="hidden md:flex items-center gap-4 absolute right-4">
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`text-xs ${language === 'es' ? 'text-white font-bold' : 'text-gray-500'}`}>
                ES
              </span>
              <div className="w-8 h-4 bg-white/10 rounded-full relative">
                <motion.div
                  className="absolute top-0.5 w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#8b5cf6' }}
                  animate={{ left: language === 'es' ? '2px' : '18px' }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className={`text-xs ${language === 'en' ? 'text-white font-bold' : 'text-gray-500'}`}>
                EN
              </span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 absolute right-4"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A] border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-4">
              <button
                onClick={navigateToAdmin}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-white/10 text-white"
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                }}
              >
                <Shield size={18} style={{ color: 'var(--accent-dynamic)' }} />
                <span className="text-sm">{t('nav.admin')}</span>
              </button>

              <div className="border-t border-white/10 pt-4" />
              
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 py-2"
                >
                  {link.name}
                </button>
              ))}
              
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-between w-full gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-sm text-gray-300">Language / Idioma</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${language === 'es' ? 'text-white font-bold' : 'text-gray-500'}`}>
                      ES
                    </span>
                    <div className="w-8 h-4 bg-white/10 rounded-full relative">
                      <motion.div
                        className="absolute top-0.5 w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#8b5cf6' }}
                        animate={{ left: language === 'es' ? '2px' : '18px' }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <span className={`text-xs ${language === 'en' ? 'text-white font-bold' : 'text-gray-500'}`}>
                      EN
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};