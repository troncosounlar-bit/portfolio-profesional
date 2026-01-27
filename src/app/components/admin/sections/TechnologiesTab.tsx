import { useState, useEffect } from 'react';
import type { Technology } from '@/app/lib/types';
import { Trash2, Plus, Save, Edit, X } from 'lucide-react';

interface TechnologiesTabProps {
  technologies: Technology[];
  editingTechnology: Technology | null;
  setEditingTechnology: (tech: Technology | null) => void;
  isAddingTechnology: boolean;
  setIsAddingTechnology: (value: boolean) => void;
  handleSaveTechnology: (tech: Technology) => void;
  handleDeleteTechnology: (id: string) => void;
}

export const TechnologiesTab = ({
  technologies,
  editingTechnology,
  setEditingTechnology,
  isAddingTechnology,
  setIsAddingTechnology,
  handleSaveTechnology,
  handleDeleteTechnology,
}: TechnologiesTabProps) => {
  const [formData, setFormData] = useState<Partial<Technology>>({
    name: '',
    logo_url: '',
    order_position: technologies.length + 1,
  });

  // Efecto para cargar los datos en el formulario cuando se presiona "Editar"
  useEffect(() => {
    if (editingTechnology) {
      setFormData(editingTechnology);
      setIsAddingTechnology(true);
    }
  }, [editingTechnology, setIsAddingTechnology]);

  const handleSubmit = () => {
    if (!formData.name) {
      alert('Por favor ingresa el nombre de la tecnología');
      return;
    }

    handleSaveTechnology(formData as Technology);
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsAddingTechnology(false);
    setEditingTechnology(null);
    setFormData({
      name: '',
      logo_url: '',
      order_position: technologies.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl flex items-center gap-2">
            <Save size={24} style={{ color: 'var(--accent-dynamic)' }} />
            Tecnologías ({technologies.length})
          </h3>
          <button
            onClick={() => {
              setEditingTechnology(null);
              setIsAddingTechnology(!isAddingTechnology);
            }}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nueva Tecnología
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAddingTechnology && (
          <div className="mb-6 p-6 bg-white/5 border border-white/20 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg text-white">
                {editingTechnology ? 'Editar Tecnología' : 'Nueva Tecnología'}
              </h4>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                placeholder="React"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-gray-300 mb-2">URL del Logo</label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes usar logos de: cdn.jsdelivr.net/gh/devicons/devicon
              </p>
              {formData.logo_url && (
                <div className="mt-3 flex items-center gap-3">
                   <img
                    src={formData.logo_url}
                    alt="Logo preview"
                    className="w-16 h-16 bg-white/10 p-2 rounded-lg object-contain"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <span className="text-xs text-gray-400 italic">Vista previa del logo</span>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-dynamic)',
                  boxShadow: '0 10px 40px var(--accent-dynamic-glow)',
                }}
              >
                <Save size={20} />
                {editingTechnology ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={handleCloseForm}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Technologies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all text-center group relative"
            >
              {tech.logo_url && (
                <img
                  src={tech.logo_url}
                  alt={tech.name}
                  className="w-12 h-12 mx-auto mb-2 object-contain"
                />
              )}
              <p className="text-white text-sm font-medium mb-1">{tech.name}</p>
              
              {/* Acciones flotantes o visibles al hacer hover */}
              <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">
                <button
                  onClick={() => setEditingTechnology(tech)}
                  className="p-1.5 hover:bg-blue-500/20 rounded-md transition-all"
                  title="Editar"
                >
                  <Edit size={14} className="text-blue-400" />
                </button>
                <button
                  onClick={() => tech.id && handleDeleteTechnology(tech.id)}
                  className="p-1.5 hover:bg-red-500/20 rounded-md transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};