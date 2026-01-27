import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { changePassword } from '@/app/lib/adminAuth';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('❌ Todos los campos son requeridos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('❌ Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('❌ La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.success) {
        toast.success(result.message);
        // Limpiar formulario
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Cerrar modal después de 1 segundo
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      toast.error('❌ Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-black/90 border border-white/20 rounded-xl p-6 w-full max-w-md relative backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Lock
                    size={24}
                    style={{ color: 'var(--accent-dynamic)' }}
                  />
                  <h2 className="text-xl text-white">
                    Cambiar Contraseña
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Nota informativa */}
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  ℹ️ Esta opción solo funciona en <strong>modo offline</strong>. Si estás usando autenticación de Supabase, cambia tu contraseña desde la configuración de tu cuenta.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contraseña actual */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Contraseña Actual *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 pr-12"
                      placeholder="Ingresa tu contraseña actual"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Nueva contraseña */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Nueva Contraseña * (mínimo 6 caracteres)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 pr-12"
                      placeholder="Ingresa tu nueva contraseña"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar nueva contraseña */}
                <div>
                  <label className="block text-gray-300 mb-2 text-sm">
                    Confirmar Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40 pr-12"
                      placeholder="Confirma tu nueva contraseña"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                      ) : (
                        <Eye size={18} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Validación visual */}
                {newPassword && confirmPassword && (
                  <div className={`text-sm p-3 rounded-lg ${
                    newPassword === confirmPassword 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {newPassword === confirmPassword ? (
                      <span>✓ Las contraseñas coinciden</span>
                    ) : (
                      <span>✗ Las contraseñas no coinciden</span>
                    )}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--accent-dynamic)',
                      boxShadow: '0 10px 40px var(--accent-dynamic-glow)',
                    }}
                  >
                    <Lock size={20} />
                    {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
