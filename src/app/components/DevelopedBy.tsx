import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const DevelopedBy = () => {
  const { t, language } = useLanguage();
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const fullText = t('devBy.text');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // CORRECCIÓN: Usamos ReturnType para que funcione en cualquier entorno (Navegador o Node)
    let timeoutId: ReturnType<typeof setTimeout>;
    let i = 0;

    const type = () => {
      if (i <= fullText.length) {
        setText(fullText.slice(0, i));
        
        const lastChar = fullText[i - 1];
        const isPausePoint = lastChar === '.' && i < fullText.length;

        i++;

        timeoutId = setTimeout(type, isPausePoint ? 500 : 20);
      } else {
        setIsFinished(true);
      }
    };

    if (isVisible) {
      setText('');
      setIsFinished(false);
      i = 0;
      type();
    } else {
      setText('');
      setIsFinished(false);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, language, fullText]);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 flex justify-center items-center relative min-h-[250px]"
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl px-6 relative group cursor-default"
          >
            <div 
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-1000 ease-out
                ${isFinished ? 'opacity-15 group-hover:opacity-30' : 'opacity-0'}
              `}
              style={{
                background: `radial-gradient(ellipse 80% 50% at center, var(--accent-dynamic-glow) 0%, transparent 80%)`,
                filter: 'blur(70px)',
                height: '150px',
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                animate={isFinished ? { 
                  y: [0, -4, 0],
                  filter: [
                    'drop-shadow(0 0 2px var(--accent-dynamic))',
                    'drop-shadow(0 0 8px var(--accent-dynamic))'
                  ]
                } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Code2 size={26} style={{ color: 'var(--accent-dynamic)' }} />
              </motion.div>

              <div className="text-center w-full">
                <p 
                  className="font-mono text-base sm:text-lg md:text-xl tracking-tight font-normal leading-relaxed"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.85)',
                    textShadow: isFinished ? `0 0 10px var(--accent-dynamic-glow)` : 'none',
                    transition: 'text-shadow 1s ease'
                  }}
                >
                  {text}
                  <span className="animate-pulse border-r border-[var(--accent-dynamic)] ml-1" />
                </p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isFinished ? { opacity: 0.6 } : { opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="mt-8"
                >
                  <span 
                    className="text-[11px] sm:text-[12px] uppercase tracking-[0.5em] text-white font-medium border border-white/20 px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm"
                  >
                    {t('devBy.badge')}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};