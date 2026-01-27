import { useState } from 'react';
import type { Stat } from '../../../lib/types'; 
import { Save, Eye, RefreshCw } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsTabProps {
  stats: Stat[];
  setStats: (stats: Stat[]) => void;
  handleSaveStat: (stat: Stat) => void;
  iconOptions: Array<{ value: string; label: string; icon: LucideIcon }>;
  getIconComponent: (iconName: string) => LucideIcon;
  pageViews: number;
}

export const StatsTab = ({
  stats,
  setStats,
  handleSaveStat,
  iconOptions,
  getIconComponent,
  pageViews,
}: StatsTabProps) => {
  const [editLang, setEditLang] = useState<'es' | 'en'>('es');

  // Función para sincronizar el valor real con el estado local
  const syncWithRealViews = (index: number) => {
    const newStats = [...stats];
    newStats[index] = {
      ...newStats[index],
      [editLang === 'es' ? 'value' : 'value_en']: `${pageViews}+`
    };
    setStats(newStats);
  };

  return (
    <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl flex items-center gap-2 text-white">
          <Save size={24} style={{ color: 'var(--accent-dynamic)' }} />
          Estadísticas ({stats.length})
        </h3>
        
        {/* Badge de Vistas Reales desde DB */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
          <Eye size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400">Total en DB:</span>
          <span className="text-xs font-bold" style={{ color: 'var(--accent-dynamic)' }}>
            {pageViews}
          </span>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg w-fit">
        {['es', 'en'].map((lang) => (
          <button
            key={lang}
            onClick={() => setEditLang(lang as 'es' | 'en')}
            className={`px-4 py-2 rounded-lg transition-all text-sm ${
              editLang === lang ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const IconComponent = getIconComponent(stat.icon);
          const isViewsStat = stat.icon.toLowerCase() === 'eye';

          return (
            <div
              key={stat.id || index}
              className={`p-4 bg-black/80 border rounded-lg relative z-0 transition-all ${
                isViewsStat ? 'border-accent-dynamic/40 shadow-[0_0_15px_rgba(0,0,0,0.5)]' : 'border-white/10'
              }`}
            >
              <div className="grid md:grid-cols-4 gap-4 items-end">
                {/* Label */}
                <div className="relative z-10">
                  <label className="block text-gray-400 mb-2 text-xs uppercase font-semibold">
                    Etiqueta {editLang === 'en' && '(EN)'}
                  </label>
                  <input
                    type="text"
                    value={editLang === 'es' ? stat.label : (stat.label_en || '')}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[index] = { ...stat, [editLang === 'es' ? 'label' : 'label_en']: e.target.value };
                      setStats(newStats);
                    }}
                    className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white text-sm focus:border-accent-dynamic outline-none"
                  />
                </div>

                {/* Value - CORREGIDO EL CONFLICTO block/flex */}
                <div className="relative z-10">
                  <label className="text-gray-400 mb-2 text-xs uppercase font-semibold flex justify-between">
                    <span>Valor {editLang === 'en' && '(EN)'}</span>
                    {isViewsStat && <span className="text-accent-dynamic text-[10px]">Auto-count</span>}
                  </label>
                  <div className="relative flex gap-2">
                    <input
                      type="text"
                      value={editLang === 'es' ? stat.value : (stat.value_en || '')}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index] = { ...stat, [editLang === 'es' ? 'value' : 'value_en']: e.target.value };
                        setStats(newStats);
                      }}
                      className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white text-sm focus:border-accent-dynamic outline-none"
                    />
                    {isViewsStat && (
                      <button
                        onClick={() => syncWithRealViews(index)}
                        title="Sincronizar con vistas reales"
                        className="p-2 bg-accent-dynamic/10 border border-accent-dynamic/30 rounded-lg text-accent-dynamic hover:bg-accent-dynamic hover:text-black transition-all"
                        style={{ color: 'var(--accent-dynamic)' }}
                      >
                        <RefreshCw size={18} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Icon Selection */}
                <div className="relative z-10">
                  <label className="block text-gray-400 mb-2 text-xs uppercase font-semibold">Ícono</label>
                  <div className="relative">
                    <select
                      value={stat.icon}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index] = { ...stat, icon: e.target.value };
                        setStats(newStats);
                      }}
                      className="w-full px-4 py-2 bg-black border border-white/20 rounded-lg text-white text-sm appearance-none outline-none cursor-pointer"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <RefreshCw size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Save Action */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <IconComponent size={22} style={{ color: 'var(--accent-dynamic)' }} />
                  </div>
                  <button
                    onClick={() => handleSaveStat(stat)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 hover:bg-accent-dynamic hover:text-black hover:border-accent-dynamic transition-all text-sm font-bold uppercase tracking-wider"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};