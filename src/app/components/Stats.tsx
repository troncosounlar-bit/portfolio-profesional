import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, FolderCheck, UserCheck, Eye, Trophy, Star, Users, Heart, Code } from 'lucide-react';
import { useSupabaseViews } from '../hooks/useSupabaseViews';
import { useSupabaseStats } from '../hooks/useSupabaseStats';
// Se eliminó el import de useLanguage que no se usaba

export const Stats = () => {
  // AJUSTE: Se eliminó const { t } = useLanguage() porque causaba el error 6133
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { views } = useSupabaseViews();
  const { stats: statsData, isLoading } = useSupabaseStats();

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

  // Icon mapping
  const iconMap: Record<string, any> = {
    clock: Clock,
    folder: FolderCheck,
    code: Code,
    eye: Eye,
    trophy: Trophy,
    star: Star,
    users: Users,
    heart: Heart,
  };

  // Map stats from Supabase with dynamic icons and replace "eye" stat with real views
  const stats = statsData.map((stat) => {
    const IconComponent = iconMap[stat.icon.toLowerCase()] || UserCheck;
    
    // If this is the views stat, use real-time views
    if (stat.icon.toLowerCase() === 'eye') {
      return {
        ...stat,
        value: `${views}+`,
        icon: IconComponent,
      };
    }
    
    return {
      ...stat,
      icon: IconComponent,
    };
  });

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-400">Cargando estadísticas...</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{
                  scale: 1.04,
                  transition: { duration: 0.5 },
                }}
                className="relative group rounded-xl p-[2px] border-2 border-white/20 transition-all duration-150"
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 shadow-[0_0_15px_var(--accent-dynamic)]" />

                {/* Contenido */}
                <div className="relative z-10 bg-black/60 rounded-xl p-6 pt-10 backdrop-blur-sm transition-all duration-150 group-hover:shadow-[0_0_20px_var(--accent-dynamic)]">
                  {/* Ícono */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/20 bg-black/70 shadow-[0_0_10px_var(--accent-dynamic)] group-hover:shadow-[0_0_20px_var(--accent-dynamic)] transition-all duration-150">
                    <Icon size={22} className="text-[var(--accent-dynamic)]" />
                  </div>

                  {/* Valor */}
                  <div
                    className="mb-2"
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 3rem)',
                      color: 'var(--accent-dynamic)',
                    }}
                  >
                    {stat.value}
                  </div>

                  {/* Etiqueta */}
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};