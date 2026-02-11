import type { ContactSubmission } from '@/app/lib/types';
import { Trash2, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactTabProps {
  messages: ContactSubmission[];
  handleDeleteMessage: (id: string) => void;
  handleMarkAsRead?: (id: string) => void; 
}

export const ContactTab = ({
  messages,
  handleDeleteMessage,
  handleMarkAsRead,
}: ContactTabProps) => {
  const unreadCount = messages.filter(m => !m.is_read).length;

  const getGmailUrl = (email: string) => {
    const subject = encodeURIComponent("Re: Mensaje del Portfolio");
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}`;
  };

  return (
    <div className="bg-black/60 border border-white/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <h3 className="text-xl flex items-center gap-2 text-white font-bold tracking-tight">
          <Mail size={24} style={{ color: 'var(--accent-dynamic)' }} />
          Bandeja de Mensajes ({messages.length})
        </h3>
        
        {unreadCount > 0 && (
          <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-black rounded-full animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.6)] border border-red-400">
            {unreadCount} PENDIENTES
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Mail size={64} className="mx-auto mb-4 opacity-10" />
          <p className="text-lg">No hay mensajes entrantes.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 sm:p-5 border-2 rounded-xl transition-all duration-300 transform hover:scale-[1.01] ${
                !message.is_read 
                  ? 'bg-red-500/10 border-red-500/40 shadow-lg shadow-red-900/10' 
                  : 'bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              {/* Contenedor Header del Mensaje: Columna en Mobile, Fila en Desktop */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1 min-w-0 w-full"> 
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                    {!message.is_read ? (
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] shrink-0" />
                    ) : (
                      <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    )}
                    
                    <h4 className={`text-lg font-bold leading-none truncate ${!message.is_read ? 'text-white' : 'text-emerald-50'}`}>
                      {message.name}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10 whitespace-nowrap">
                      {new Date(message.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  
                  <a
                    href={getGmailUrl(message.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-semibold underline decoration-transparent hover:decoration-current transition-all break-all ${
                      !message.is_read ? 'text-red-300 hover:text-white' : 'text-emerald-300 hover:text-emerald-100'
                    }`}
                  >
                    {message.email}
                  </a>
                </div>
                
                {/* Botones: Full width en mobile */}
                <div className="flex w-full sm:w-auto gap-2">
                  <a
                    href={getGmailUrl(message.email)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => message.id && handleMarkAsRead?.(message.id)}
                    className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-lg transition-all text-xs sm:text-sm font-black flex items-center justify-center gap-2 border-2 shadow-sm ${
                      !message.is_read 
                        ? 'bg-red-600 border-red-400 text-white hover:bg-red-500 hover:shadow-red-500/40' 
                        : 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-500 hover:shadow-emerald-500/40'
                    }`}
                  >
                    <MessageSquare size={16} />
                    {message.is_read ? 'RE-ENVIAR' : 'RESPONDER'}
                  </a>
                  
                  <button
                    onClick={() => message.id && handleDeleteMessage(message.id)}
                    className="p-2.5 bg-black/40 hover:bg-red-600 border border-white/10 rounded-lg transition-all group hover:border-red-400 shadow-sm shrink-0"
                  >
                    <Trash2 size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Cuerpo del mensaje */}
              <div className={`p-4 rounded-lg text-sm sm:text-[15px] leading-relaxed border break-words ${
                !message.is_read 
                  ? 'bg-white/5 text-gray-50 border-white/10 font-medium' 
                  : 'bg-emerald-900/20 text-emerald-50 border-emerald-500/20'
              }`}>
                {message.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};