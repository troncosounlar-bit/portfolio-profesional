import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowLeft, ShieldAlert, MapPin, Globe, AlertTriangle } from "lucide-react";
import { supabase } from '../../lib/client'; 
import {
  checkAdminLogin,
  isAccountLocked,
  getRemainingAttempts,
} from "../../lib/adminAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface AdminLoginProps {
  onNavigateBack?: () => void;
  onLoginSuccess: () => void;
}

export const AdminLogin = ({
  onNavigateBack,
  onLoginSuccess,
}: AdminLoginProps) => {
  // --- ESTADOS ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockStatus, setLockStatus] = useState<{ locked: boolean; remainingTime?: number }>({ locked: false });
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [intruderData, setIntruderData] = useState<any>(null);

  const warnings = [
    "POR FAVOR, SI NO ERES UN USUARIO NO LO HAGAS.",
    "TE DIJE QUE NO LO HAGAS.",
    "OK, QUE AVISE. REGISTRANDO UBICACIÓN FÍSICA..."
  ];

  useEffect(() => {
    const status = isAccountLocked();
    setLockStatus(status);
    setRemainingAttempts(getRemainingAttempts());
    
    if (status.locked) {
        fetchIntruderData();
    }
  }, []);

  const fetchIntruderData = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setIntruderData(data);
      return data;
    } catch (err) {
      console.error("Error capturando datos de seguridad");
      return null;
    }
  };

  const logSecurityEvent = async (attemptsLeft: number, data: any) => {
    if (!data) return;
    try {
      await supabase.from('security_logs').insert({
        event_type: attemptsLeft <= 0 ? 'blocked_user' : 'failed_attempt',
        ip_address: data.ip,
        city: data.city,
        country: data.country_name,
        latitude: data.latitude?.toString(),
        longitude: data.longitude?.toString(),
        org: data.org,
        user_agent: navigator.userAgent,
        attempt_count: 3 - attemptsLeft
      });
    } catch (err) {
      console.warn("Log de seguridad fallido");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    if (lockStatus.locked) {
      setAuthError(`🔒 SISTEMA BLOQUEADO PROTEGIDO`);
      setIsLoading(false);
      return;
    }

    try {
      const offlineResult = await checkAdminLogin(email, password);

      if (offlineResult.success) {
        toast.success("✅ Acceso Concedido");
        onLoginSuccess();
      } else {
        const data = await fetchIntruderData();
        const newRemaining = getRemainingAttempts();
        
        // ACTUALIZAMOS EL ESTADO QUE TS DECÍA QUE NO USÁBAMOS
        setRemainingAttempts(newRemaining);
        
        await logSecurityEvent(newRemaining, data);

        const warningIdx = 3 - newRemaining - 1;
        setAuthError(warnings[warningIdx] || "ACCESO DENEGADO");

        const newLockStatus = isAccountLocked();
        setLockStatus(newLockStatus);
        
        if (newLockStatus.locked) {
          toast.error("SISTEMA BLOQUEADO: RASTREO INICIADO");
        }
      }
    } catch (error) {
      setAuthError("❌ ERROR CRÍTICO DE SEGURIDAD");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Botón Volver */}
      <button
        onClick={() => onNavigateBack ? onNavigateBack() : window.history.back()}
        className="absolute top-6 left-6 text-white/40 hover:text-white transition-all p-2 z-20 bg-white/5 rounded-full border border-white/10"
      >
        <ArrowLeft size={20} />
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className={`transition-all duration-700 bg-zinc-950 border-2 ${lockStatus.locked ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]' : 'border-white/5'} rounded-[2.5rem] p-10 backdrop-blur-3xl`}>
          
          <div className="text-center mb-10">
            <motion.div 
              animate={lockStatus.locked ? { 
                scale: [1, 1.05, 1],
                boxShadow: ["0 0 0px rgba(220,38,38,0)", "0 0 20px rgba(220,38,38,0.4)", "0 0 0px rgba(220,38,38,0)"]
              } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 transition-colors duration-500 ${lockStatus.locked ? 'bg-red-600/10 border-red-600' : 'bg-zinc-900 border-white/10'}`}
            >
              {lockStatus.locked ? (
                <ShieldAlert size={48} className="text-red-600" />
              ) : (
                <Lock size={36} style={{ color: "var(--accent-dynamic)" }} />
              )}
            </motion.div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              {lockStatus.locked ? "Intruso Detectado" : "Admin Login"}
            </h2>
            
            {/* SOLUCIÓN AL ERROR: USAMOS LA VARIABLE AQUÍ */}
            {!lockStatus.locked && remainingAttempts < 3 && (
              <div className="flex items-center justify-center gap-2 mt-2 text-amber-500 animate-pulse">
                <AlertTriangle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Quedan {remainingAttempts} intentos
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={lockStatus.locked || isLoading}
              className="w-full px-6 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-red-600/50 transition-all disabled:opacity-20 font-mono text-sm"
              placeholder="ADMIN_USER"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={lockStatus.locked || isLoading}
              className="w-full px-6 py-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-red-600/50 transition-all disabled:opacity-20 font-mono text-sm"
              placeholder="ADMIN_KEY"
              required
            />

            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-tighter text-center"
              >
                {authError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading || lockStatus.locked}
              className="w-full py-5 rounded-2xl text-white transition-all duration-500 font-black uppercase tracking-[0.2em] text-xs relative overflow-hidden active:scale-95"
              style={{
                backgroundColor: lockStatus.locked ? "#1a0000" : "var(--accent-dynamic)",
                boxShadow: lockStatus.locked ? "none" : "0 10px 20px -10px var(--accent-dynamic-glow)"
              }}
            >
              {isLoading ? "ENCRIPTANDO..." : lockStatus.locked ? "SISTEMA SELLADO" : "VERIFICAR IDENTIDAD"}
            </button>
          </form>
        </div>

        {/* --- PANEL DEL INTRUSO --- */}
        <AnimatePresence>
          {lockStatus.locked && intruderData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-zinc-950 border-2 border-red-600/30 rounded-[2rem] p-8 backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe size={100} className="text-red-600" />
              </div>

              <div className="flex items-center gap-3 mb-6 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Localización GPS en curso...</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-[11px] font-mono relative z-10">
                <div className="space-y-1">
                  <p className="text-zinc-600 text-[9px] uppercase font-bold">IP Privada</p>
                  <p className="text-red-100/90">{intruderData.ip}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-600 text-[9px] uppercase font-bold">Región</p>
                  <p className="text-red-100/90">{intruderData.city}, {intruderData.country_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-zinc-600 text-[9px] uppercase font-bold">Nodo ISP</p>
                  <p className="text-red-100/90 truncate">{intruderData.org}</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-zinc-600 text-[9px] uppercase font-bold">Coords</p>
                    <p className="text-red-100/90">{intruderData.latitude}, {intruderData.longitude}</p>
                </div>
              </div>

              <a 
                href={`https://www.google.com/maps?q=${intruderData.latitude},${intruderData.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-red-600 text-white text-[10px] font-black rounded-2xl transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-900/40"
              >
                <MapPin size={16} />
                ABRIR EN GOOGLE MAPS SATELLITE
              </a>

              <p className="text-[9px] text-zinc-700 text-center mt-4 font-mono">
                ID_LOG: {Math.random().toString(36).substr(2, 9).toUpperCase()} | POS_ACCURACY: HIGH
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Efecto visual de Scan */}
      {lockStatus.locked && (
          <motion.div 
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-[2px] bg-red-600/30 blur-sm z-0"
          />
      )}
    </div>
  );
};