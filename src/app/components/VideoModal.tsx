import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export const VideoModal = ({ isOpen, onClose, videoUrl, title }: VideoModalProps) => {
  const [videoError, setVideoError] = useState(false);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
      setVideoError(false); // Reset error state cuando se abre
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-black/60 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white text-lg">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full"
                src={videoUrl}
                onError={() => setVideoError(true)}
              >
                Tu navegador no soporta el elemento de video.
              </video>
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm">
                  No se pudo cargar el video
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <p className="text-gray-400 text-sm text-center">
                Presiona ESC o haz click fuera del video para cerrar
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};