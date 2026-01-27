import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, LogOut, Palette, Home, Briefcase, FolderKanban, 
  BarChart3, Code, Sparkles, UserCircle, MessageSquare, 
  Globe, KeyRound, Database, RefreshCw, AlertCircle
} from 'lucide-react';

import { useAdminData } from "../hooks/useAdminData";
import { StyleSection } from "./admin/sections/StyleSection";
import { HeroTab } from './admin/sections/HeroTab';
import { ExperienceTab } from './admin/sections/ExperienceTab';
import { ProjectsTab } from './admin/sections/ProjectsTab';
import { StatsTab } from './admin/sections/StatsTab';
import { SkillsTab } from './admin/sections/SkillsTab';
import { TechnologiesTab } from './admin/sections/TechnologiesTab';
import { AboutTab } from './admin/sections/AboutTab';
import { ContactTab } from './admin/sections/ContactTab';
import { ChangePasswordModal } from '@/app/components/admin/ChangePasswordModal';

import { iconOptions, getIconComponent } from '@/app/utils/iconHelpers';
import { getPendingChangesCount } from '@/app/lib/offlineCrud';

type TabType = 'style' | 'hero' | 'experience' | 'projects' | 'stats' | 'skills' | 'technologies' | 'about' | 'contact';

interface AdminDashboardProps {
  onNavigateBack?: () => void;
}

export const AdminDashboard = ({ onNavigateBack }: AdminDashboardProps) => {
  const { 
    state, 
    setters, 
    actions, 
    isAuthenticated, 
    isLoading, 
    isSystemOnline, 
    authError, 
    activeTab, 
    setActiveTab 
  } = useAdminData();

  // --- ESTADOS LOCALES UI ---
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Cálculo de cambios pendientes para la barra de sincronización
  const pendingCount = useMemo(() => getPendingChangesCount(), [state]);

  // ✅ Cálculo de mensajes no leídos para el badge del menú
  const unreadMessagesCount = useMemo(() => 
    state.messages.filter(m => !m.is_read).length, 
  [state.messages]);

  const tabs: { id: TabType; label: string; icon: any; count?: number; isUrgent?: boolean }[] = [
    { id: 'style', label: 'Estilo', icon: Palette },
    { id: 'hero', label: 'Hero', icon: Home },
    { id: 'experience', label: 'Experiencia', icon: Briefcase, count: state.experiences.length },
    { id: 'projects', label: 'Proyectos', icon: FolderKanban, count: state.projects.length },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3, count: state.stats.length },
    { id: 'skills', label: 'Habilidades', icon: Code },
    { id: 'technologies', label: 'Tecnologías', icon: Sparkles, count: state.technologies.length },
    { id: 'about', label: 'Acerca de', icon: UserCircle },
    // ✅ Badge de mensajes actualizado: Solo muestra no leídos y marca como urgente si hay > 0
    { id: 'contact', label: 'Mensajes', icon: MessageSquare, count: unreadMessagesCount, isUrgent: unreadMessagesCount > 0 },
  ];

  // --- RENDER DE CARGA ---
  if (isLoading && !isAuthenticated && !authError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
          <div className="text-white/60 animate-pulse font-medium">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  // --- RENDER DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
        <button
          onClick={() => (onNavigateBack ? onNavigateBack() : window.history.back())}
          className="absolute top-4 left-4 text-white/80 hover:text-white transition"
        >
          <ArrowLeft size={28} />
        </button>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <div className="bg-black/60 border border-white/20 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
            <div className="text-center mb-8">
              <Palette size={48} className="mx-auto mb-4" style={{ color: 'var(--accent-dynamic)' }} />
              <h2 className="text-2xl text-white mb-2 font-bold">Admin Dashboard</h2>
              <p className="text-gray-400">Inicia sesión para continuar</p>
              
              <div className="flex justify-center mt-4">
                {isSystemOnline ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest">
                    ● Sistema Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                    ● Modo Offline
                  </span>
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                actions.handleLogin(email, password);
              }}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white outline-none focus:border-white/40 transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white outline-none focus:border-white/40 transition-colors"
                required
              />

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={16} /> {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg text-white transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'var(--accent-dynamic)', 
                  boxShadow: '0 10px 40px var(--accent-dynamic-glow)' 
                }}
              >
                {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDER DEL DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              {isSystemOnline ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] uppercase tracking-wider font-bold">
                  <Globe size={10} /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] uppercase tracking-wider font-bold">
                  <Database size={10} /> Modo Offline
                </span>
              )}
            </div>
            <p className="text-gray-400">Gestiona todo el contenido de tu portfolio</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm font-medium"
            >
              <KeyRound size={18} /> Cambiar Clave
            </button>
            <button
              onClick={actions.handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 text-sm font-medium"
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>

        {/* BARRA DE SINCRONIZACIÓN */}
        <AnimatePresence>
          {pendingCount > 0 && isSystemOnline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                    <RefreshCw size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <p className="font-bold text-yellow-500">Cambios pendientes</p>
                    <p className="text-xs text-yellow-500/70">Tienes {pendingCount} elementos creados en modo offline listos para subir.</p>
                  </div>
                </div>
                <button 
                  onClick={() => actions.syncOfflineChanges()}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all text-sm whitespace-nowrap"
                >
                  <Database size={16} /> {isLoading ? 'Sincronizando...' : 'Sincronizar ahora'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NAVEGACIÓN - PESTAÑAS */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap relative ${
                  isActive 
                    ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
                }`}
                style={isActive ? { borderColor: 'var(--accent-dynamic)', color: 'var(--accent-dynamic)' } : {}}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.label}</span>
                
                {/* Badge dinámico: Rojo si es urgente (mensajes no leídos) */}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                    tab.isUrgent 
                      ? 'bg-red-600 text-white animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]' 
                      : (isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400')
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTENIDO DINÁMICO */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 pb-20"
        >
          {activeTab === 'style' && (
            <StyleSection
              styleSettings={state.styleSettings}
              setStyleSettings={setters.setStyleSettings}
              saveStyleSettings={() => actions.saveStyleSettings(state.styleSettings)}
              newColorName="" setNewColorName={() => {}}
              newColorMain="#ffffff" setNewColorMain={() => {}}
              addColor={() => {}} removeColor={() => {}}
            />
          )}

          {activeTab === 'hero' && state.heroData && (
            <HeroTab
              heroData={state.heroData}
              setHeroData={setters.setHeroData}
              handleHeroImageUpload={actions.handleHeroImageUpload}
              uploadingHeroImage={state.uploadingHeroImage}
              saveHeroData={actions.saveHeroData}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceTab
              experiences={state.experiences}
              editingExperience={state.editingExperience}
              setEditingExperience={setters.setEditingExperience}
              isAddingExperience={state.isAddingExperience}
              setIsAddingExperience={setters.setIsAddingExperience}
              handleSaveExperience={actions.handleSaveExperience}
              handleDeleteExperience={actions.handleDeleteExperience}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTab
              projects={state.projects}
              editingProject={state.editingProject}
              setEditingProject={setters.setEditingProject}
              isAddingProject={state.isAddingProject}
              setIsAddingProject={setters.setIsAddingProject}
              handleSaveProject={actions.handleSaveProject}
              handleDeleteProject={actions.handleDeleteProject}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab
              stats={state.stats}
              setStats={setters.setStats}
              handleSaveStat={actions.handleSaveStat}
              iconOptions={iconOptions}
              getIconComponent={getIconComponent}
              pageViews={state.pageViews}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsTab
              skillCategories={state.skillCategories}
              editingSkill={state.editingSkill}
              setEditingSkill={setters.setEditingSkill}
              isAddingSkill={state.isAddingSkill}
              setIsAddingSkill={setters.setIsAddingSkill}
              selectedCategoryForNewSkill={state.selectedCategoryForNewSkill}
              setSelectedCategoryForNewSkill={setters.setSelectedCategoryForNewSkill}
              handleSaveSkill={actions.handleSaveSkill}
              handleDeleteSkill={actions.handleDeleteSkill}
            />
          )}

          {activeTab === 'technologies' && (
            <TechnologiesTab
              technologies={state.technologies}
              editingTechnology={state.editingTechnology}
              setEditingTechnology={setters.setEditingTechnology}
              isAddingTechnology={state.isAddingTechnology}
              setIsAddingTechnology={setters.setIsAddingTechnology}
              handleSaveTechnology={actions.handleSaveTechnology}
              handleDeleteTechnology={actions.handleDeleteTechnology}
            />
          )}

          {activeTab === 'about' && state.aboutData && (
            <AboutTab
              aboutData={state.aboutData}
              setAboutData={setters.setAboutData}
              workPhilosophy={state.workPhilosophy}
              editingPhilosophy={state.editingPhilosophy}
              setEditingPhilosophy={setters.setEditingPhilosophy}
              isAddingPhilosophy={state.isAddingPhilosophy}
              setIsAddingPhilosophy={setters.setIsAddingPhilosophy}
              saveAboutData={actions.saveAboutData}
              handleSavePhilosophy={actions.handleSavePhilosophy}
              handleDeletePhilosophy={actions.handleDeletePhilosophy}
              iconOptions={iconOptions}
              getIconComponent={getIconComponent}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab 
              messages={state.messages} 
              handleDeleteMessage={actions.handleDeleteMessage}
              // ✅ Pasamos la nueva acción para marcar como leído
              handleMarkAsRead={actions.handleMarkAsRead} 
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};