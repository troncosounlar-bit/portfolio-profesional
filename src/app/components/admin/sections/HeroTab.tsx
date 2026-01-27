// src/app/components/admin/sections/HeroTab.tsx
import { useState } from 'react';
import type { HeroData } from '../../../lib/types.ts'; 
// SE ELIMINÓ LA IMPORTACIÓN DE uploadImage YA QUE SE USA EL PROP handleHeroImageUpload
import { Save, Upload, Home } from 'lucide-react';

interface HeroTabProps {
  heroData: HeroData;
  setHeroData: (data: HeroData) => void;
  handleHeroImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingHeroImage: boolean;
  saveHeroData: () => void;
}

export const HeroTab = ({
  heroData,
  setHeroData,
  handleHeroImageUpload,
  uploadingHeroImage,
  saveHeroData,
}: HeroTabProps) => {
  const [editLang, setEditLang] = useState<'es' | 'en'>('es');

  return (
    <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-xl mb-6 flex items-center gap-2">
        <Home size={24} style={{ color: 'var(--accent-dynamic)' }} />
        Editor del Hero
      </h3>

      {/* Language Toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg w-fit">
        <button
          onClick={() => setEditLang('es')}
          className={`px-4 py-2 rounded-lg transition-all ${
            editLang === 'es'
              ? 'bg-white/20 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🇪🇸 Español
        </button>
        <button
          onClick={() => setEditLang('en')}
          className={`px-4 py-2 rounded-lg transition-all ${
            editLang === 'en'
              ? 'bg-white/20 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-gray-300 mb-2 font-bold">Foto de Perfil</label>
          {heroData.profile_image_url && (
            <img
              src={heroData.profile_image_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-white/20 shadow-xl"
            />
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2 text-sm">
                <Upload size={18} />
                {uploadingHeroImage ? 'Subiendo...' : 'Subir Imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                  disabled={uploadingHeroImage}
                />
              </label>
              {heroData.profile_image_url && (
                <button
                  onClick={() => setHeroData({ ...heroData, profile_image_url: '' })}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all text-sm text-red-500"
                >
                  Eliminar
                </button>
              )}
            </div>
            
            <div>
              <label className="block text-gray-400 text-xs mb-2 uppercase tracking-widest">
                O URL Externa
              </label>
              <input
                type="url"
                value={heroData.profile_image_url || ''}
                onChange={(e) => setHeroData({ ...heroData, profile_image_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-600 text-sm focus:border-white/40 outline-none transition-all"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
        </div>

        {/* Formulario de Datos */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-tighter font-bold">
              Saludo {editLang === 'en' && '(English)'}
            </label>
            <input
              type="text"
              value={editLang === 'es' ? heroData.greeting : (heroData.greeting_en || '')}
              onChange={(e) =>
                setHeroData({
                  ...heroData,
                  [editLang === 'es' ? 'greeting' : 'greeting_en']: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white outline-none focus:border-white/40 transition-all"
              placeholder={editLang === 'es' ? '¡Hola! Soy' : 'Hi! I am'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-tighter font-bold">Nombre</label>
            <input
              type="text"
              value={heroData.first_name}
              onChange={(e) => setHeroData({ ...heroData, first_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white outline-none focus:border-white/40 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-tighter font-bold">Apellido</label>
            <input
              type="text"
              value={heroData.last_name}
              onChange={(e) => setHeroData({ ...heroData, last_name: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white outline-none focus:border-white/40 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400 uppercase tracking-tighter font-bold">
              Título / Rol {editLang === 'en' && '(English)'}
            </label>
            <input
              type="text"
              value={editLang === 'es' ? heroData.title : (heroData.title_en || '')}
              onChange={(e) =>
                setHeroData({
                  ...heroData,
                  [editLang === 'es' ? 'title' : 'title_en']: e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white outline-none focus:border-white/40 transition-all"
              placeholder={editLang === 'es' ? 'Desarrollador Full Stack' : 'Full Stack Developer'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400 uppercase tracking-tighter font-bold">
            Descripción {editLang === 'en' && '(English)'}
          </label>
          <textarea
            value={editLang === 'es' ? heroData.description : (heroData.description_en || '')}
            onChange={(e) =>
              setHeroData({
                ...heroData,
                [editLang === 'es' ? 'description' : 'description_en']: e.target.value,
              })
            }
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white h-32 outline-none focus:border-white/40 transition-all resize-none"
            placeholder={editLang === 'es' ? 'Escribe tu descripción...' : 'Write your description...'}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-bold italic">GitHub</label>
            <input
              type="url"
              value={heroData.github_url || ''}
              onChange={(e) => setHeroData({ ...heroData, github_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-bold italic">LinkedIn</label>
            <input
              type="url"
              value={heroData.linkedin_url || ''}
              onChange={(e) => setHeroData({ ...heroData, linkedin_url: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400 font-bold italic">Email</label>
            <input
              type="email"
              value={heroData.email || ''}
              onChange={(e) => setHeroData({ ...heroData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <button
          onClick={saveHeroData}
          className="w-full px-8 py-4 rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-2 font-black uppercase tracking-widest active:scale-95 hover:brightness-110"
          style={{
            backgroundColor: 'var(--accent-dynamic)',
            boxShadow: '0 10px 40px var(--accent-dynamic-glow)',
          }}
        >
          <Save size={20} />
          Actualizar Hero
        </button>
      </div>
    </div>
  );
};