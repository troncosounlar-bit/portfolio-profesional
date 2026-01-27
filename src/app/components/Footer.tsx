import { motion } from 'motion/react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabaseHero } from '../hooks/useSupabaseHero';

export const Footer = () => {
  const { t } = useLanguage();
  const { heroData } = useSupabaseHero();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: heroData?.github_url,
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: heroData?.linkedin_url,
      label: 'LinkedIn',
    },
    {
      icon: Mail,
      // MODIFICACIÓN: Enlace directo a la interfaz de redactar de Gmail
      href: heroData?.email 
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${heroData.email}` 
        : undefined,
      label: 'Email',
    },
  ].filter(link => Boolean(link.href));

  const quickLinks = [
    { name: t('nav.about'), id: 'about' },
    { name: t('nav.experience'), id: 'experience' },
    { name: t('nav.skills'), id: 'skills' },
    { name: t('nav.projects'), id: 'projects' },
    { name: t('nav.contact'), id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center border-2"
                style={{
                  borderColor: 'var(--accent-dynamic)',
                  boxShadow: `0 0 20px var(--accent-dynamic-glow)`,
                }}
              >
                <span style={{ color: 'var(--accent-dynamic)' }}>PT</span>
              </div>
              <span className="text-white">
                {heroData?.first_name} {heroData?.last_name}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="text-white mb-4">{t('footer.sections')}</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white mb-4">{t('footer.connect')}</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} {heroData?.first_name} {heroData?.last_name}. {t('footer.rights')}
            </p>
        
            <p className="text-gray-400 text-sm flex items-center gap-2">
              {t('footer.built')}
              <Heart size={16} fill="var(--accent-dynamic)" />
              {t('footer.coffe')}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};