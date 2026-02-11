import { motion } from 'motion/react';
import { useSupabaseTechnologies } from '../hooks/useSupabaseTechnologies';

export const TechBanner = () => {
  const { technologies, isLoading } = useSupabaseTechnologies();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-400">Cargando tecnologías...</div>
      </div>
    );
  }

  // Duplicamos el array para el efecto infinito
  const duplicatedTechs = [...technologies, ...technologies];

  return (
    <div className="relative overflow-hidden py-8">
      {/* Gradients laterales para suavizar bordes */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      
      {/* Contenedor de la animación */}
      <div className="flex w-max"> 
        <motion.div
          className="flex gap-12 items-center pr-12" // Añadimos padding-right igual al gap para cerrar el ciclo
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: technologies.length * 3, // Un poco más lento suele verse más fluido
              ease: "linear",
            },
          }}
        >
          {duplicatedTechs.map((tech, index) => (
            <div
              key={`${tech.id}-${index}`}
              className="flex flex-col items-center justify-center gap-3 min-w-[120px] group"
            >
              <div 
                className="w-16 h-16 flex items-center justify-center rounded-xl bg-black/60 border border-white/10 transition-all duration-300 group-hover:border-[var(--accent-dynamic)] group-hover:shadow-[0_0_20px_var(--accent-dynamic-glow)]"
              >
                {tech.logo_url ? (
                  <img
                    src={tech.logo_url}
                    alt={tech.name}
                    loading="lazy"
                    className="w-10 h-10 object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.fallback-initial')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'text-2xl fallback-initial';
                        fallback.style.color = 'var(--accent-dynamic)';
                        fallback.textContent = tech.name.charAt(0);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="text-2xl" style={{ color: 'var(--accent-dynamic)' }}>
                    {tech.name.charAt(0)}
                  </div>
                )}
              </div>
              
              <span className="text-sm text-gray-300 font-medium text-center whitespace-nowrap group-hover:text-[var(--accent-dynamic)] transition-colors duration-300">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};