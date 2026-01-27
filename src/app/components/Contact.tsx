import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/client';
import { useLanguage } from '../contexts/LanguageContext';

export const Contact = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      // Único cambio: leer desde import.meta.env en lugar de una variable inexistente
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      if (!supabaseUrl || supabaseUrl === '') {
        // Si Supabase no está configurado, abrir Gmail directamente
        const subject = encodeURIComponent(`Mensaje de ${formData.name} - Portfolio`);
        const body = encodeURIComponent(
          `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
        );
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=pablotroncoso.jobs@gmail.com&su=${subject}&body=${body}`;
        
        // Abrir en nueva ventana
        window.open(gmailUrl, '_blank');
        
        // Limpiar formulario y mostrar mensaje
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus('success');
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
        
        setIsSubmitting(false);
        return;
      }

      // Insertar en Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });

      if (error) {
        // Si hay error de Supabase, también redirigir a Gmail
        const subject = encodeURIComponent(`Mensaje de ${formData.name} - Portfolio`);
        const body = encodeURIComponent(
          `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
        );
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=pablotroncoso.jobs@gmail.com&su=${subject}&body=${body}`;
        
        window.open(gmailUrl, '_blank');
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus('success');
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
        
        setIsSubmitting(false);
        return;
      }

      // Éxito
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error);
      
      // En caso de cualquier error, abrir Gmail como fallback
      const subject = encodeURIComponent(`Mensaje de ${formData.name} - Portfolio`);
      const body = encodeURIComponent(
        `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
      );
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=pablotroncoso.jobs@gmail.com&su=${subject}&body=${body}`;
      
      window.open(gmailUrl, '_blank');
      setFormData({ name: '', email: '', message: '' });
      setSubmitStatus('success');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.info.email'),
      content: 'pablotroncoso.jobs@gmail.com',
      link: 'mailto:pablotroncoso.jobs@gmail.com',
    },
    {
      icon: MapPin,
      title: t('contact.info.location'),
      content: t('contact.location'),
      link: null,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 lg:px-8 relative"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">
            <span className="text-gray-400 text-sm sm:text-base uppercase tracking-wider">
              {t('contact.subtitle')}
            </span>
          </h2>
          <h3
            className="text-white mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            {t('contact.title')}{' '}
            <span
              style={{
                color: 'var(--accent-dynamic)',
                textShadow: `0 0 30px var(--accent-dynamic-glow)`,
              }}
            >
              {t('contact.title.highlight')}
            </span>
          </h3>
          <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--accent-dynamic)' }} />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h4 className="text-white mb-4">{t('contact.intro.title')}</h4>
              <p className="text-gray-400 leading-relaxed mb-8">
                {t('contact.intro.text')}
              </p>
            </div>

            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      border: '2px solid var(--accent-dynamic)',
                    }}
                  >
                    <Icon size={20} style={{ color: 'var(--accent-dynamic)' }} />
                  </div>
                  <div>
                    <h5 className="text-white mb-1">{info.title}</h5>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {info.content}
                      </a>
                    ) : (
                      <p className="text-gray-400">{info.content}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-dynamic)] focus:shadow-[0_0_20px_var(--accent-dynamic-glow)] transition-all duration-300"
                  placeholder={t('contact.form.name.placeholder')}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-dynamic)] focus:shadow-[0_0_20px_var(--accent-dynamic-glow)] transition-all duration-300"
                  placeholder={t('contact.form.email.placeholder')}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-dynamic)] focus:shadow-[0_0_20px_var(--accent-dynamic-glow)] transition-all duration-300 resize-none"
                  placeholder={t('contact.form.message.placeholder')}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--accent-dynamic)',
                  boxShadow: `0 10px 40px var(--accent-dynamic-glow)`,
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>{t('contact.form.btn.sending')}</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('contact.form.btn.submit')}</span>
                  </>
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <div className="mt-4 text-green-500 flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>{t('contact.form.success')}</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 text-red-500 flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{errorMessage || t('contact.form.error')}</span>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};