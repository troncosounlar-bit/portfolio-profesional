import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
      {/* Partículas de fondo */}
      <ParticlesBackground />

      {/* Contenido del loading */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div 
            className="w-20 h-20 rounded-full border-4 border-white/10"
            style={{
              borderTopColor: 'var(--accent-dynamic)',
            }}
          >
            <Loader2 
              className="w-20 h-20 animate-spin" 
              style={{ color: 'var(--accent-dynamic)' }}
            />
          </div>
          
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{
              background: 'var(--accent-dynamic-glow)',
            }}
          />
        </motion.div>

        {/* Texto de carga */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-white text-xl mb-2">Cargando...</p>
          <p className="text-gray-400 text-sm">Preparando el panel</p>
        </motion.div>

        {/* Barra de progreso */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '200px', opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 2, 
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, var(--accent-dynamic), transparent)`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
