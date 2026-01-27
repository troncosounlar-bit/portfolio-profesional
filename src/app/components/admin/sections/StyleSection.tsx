import { Palette, Trash2, Plus, Save } from 'lucide-react';
import type { StyleSettings } from '@/app/lib/types';

interface StyleSectionProps {
  styleSettings: StyleSettings;
  setStyleSettings: (settings: StyleSettings) => void;
  newColorName: string;
  setNewColorName: (name: string) => void;
  newColorMain: string;
  setNewColorMain: (color: string) => void;
  addColor: () => void;
  removeColor: (id: string) => void;
  saveStyleSettings: () => void;
}

export const StyleSection = ({
  styleSettings,
  setStyleSettings,
  newColorName,
  setNewColorName,
  newColorMain,
  setNewColorMain,
  addColor,
  removeColor,
  saveStyleSettings,
}: StyleSectionProps) => {
  
  // Seguridad extra: Si styleSettings es null o undefined por error de carga
  if (!styleSettings) {
    return (
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 text-center">
        <p className="text-gray-400 italic">Cargando configuración de estilo...</p>
      </div>
    );
  }

  // Extraemos los colores de forma segura para usar en el resto del componente
  const accentColors = styleSettings?.accentColors || [];

  return (
    <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-xl mb-6 flex items-center gap-2">
        <Palette size={24} style={{ color: 'var(--accent-dynamic)' }} />
        Configuración de Estilo
      </h3>

      <div className="space-y-6">
        {/* Particle Count */}
        <div>
          <label className="block text-gray-300 mb-2">
            Número de Partículas de Fondo: {styleSettings?.particleCount ?? 0}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            value={styleSettings?.particleCount ?? 150}
            onChange={(e) => setStyleSettings({ ...styleSettings, particleCount: parseInt(e.target.value) })}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>150</span>
            <span>300</span>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h4 className="text-gray-300 mb-4">Colores de Acento ({accentColors.length})</h4>
          <div className="grid gap-3">
            {accentColors.length === 0 ? (
              <p className="text-gray-500 text-sm italic p-4 border border-dashed border-white/10 rounded-lg text-center">
                No hay colores configurados.
              </p>
            ) : (
              accentColors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div
                    className="w-12 h-12 rounded-lg border border-white/20"
                    style={{ backgroundColor: color.main }}
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{color.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{color.main}</p>
                  </div>
                  <button
                    onClick={() => removeColor(color.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-all group"
                    title="Eliminar color"
                  >
                    <Trash2 size={18} className="text-red-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Color */}
          <div className="mt-4 p-4 bg-white/5 border border-white/20 rounded-lg">
            <p className="text-white text-sm mb-3 font-medium">Agregar Nuevo Color</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nombre (ej: Neon Blue)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/40"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newColorMain}
                  onChange={(e) => setNewColorMain(e.target.value)}
                  className="w-12 h-10 bg-transparent border-none cursor-pointer"
                />
                <button
                  onClick={addColor}
                  disabled={!newColorName || !newColorMain}
                  className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm text-white"
                >
                  <Plus size={16} />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveStyleSettings}
          className="w-full px-8 py-4 rounded-lg text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--accent-dynamic, #ffffff)',
            boxShadow: '0 10px 40px var(--accent-dynamic-glow, rgba(255,255,255,0.1))',
          }}
        >
          <Save size={20} />
          Guardar Configuración de Estilo
        </button>
      </div>
    </div>
  );
};