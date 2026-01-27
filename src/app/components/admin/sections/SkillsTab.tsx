import { useState, useEffect } from 'react';
import type { Skill, SkillCategory } from '@/app/lib/types';
import { Trash2, Plus, Save, Edit, X } from 'lucide-react';

interface SkillsTabProps {
  skillCategories: Array<SkillCategory & { skills: Skill[] }>;
  editingSkill: Skill | null;
  setEditingSkill: (skill: Skill | null) => void;
  isAddingSkill: boolean;
  setIsAddingSkill: (value: boolean) => void;
  selectedCategoryForNewSkill: string;
  setSelectedCategoryForNewSkill: (value: string) => void;
  handleSaveSkill: (skill: Skill) => void;
  handleDeleteSkill: (id: string) => void;
}

export const SkillsTab = ({
  skillCategories,
  editingSkill,
  setEditingSkill,
  isAddingSkill,
  setIsAddingSkill,
  selectedCategoryForNewSkill,
  setSelectedCategoryForNewSkill,
  handleSaveSkill,
  handleDeleteSkill,
}: SkillsTabProps) => {
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    level: 50,
    category_id: selectedCategoryForNewSkill || '',
    order_position: 0,
  });

  // Sincronizar el formulario cuando se entra en modo edición
  useEffect(() => {
    if (editingSkill) {
      setFormData(editingSkill);
      setIsAddingSkill(true);
    }
  }, [editingSkill, setIsAddingSkill]);

  const handleSubmit = () => {
    if (!formData.name || !formData.category_id) {
      alert('Por favor completa todos los campos');
      return;
    }

    handleSaveSkill(formData as Skill);
    handleCloseForm();
  };

  const handleCloseForm = () => {
    setIsAddingSkill(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      level: 50,
      category_id: selectedCategoryForNewSkill || '',
      order_position: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl flex items-center gap-2">
            <Save size={24} style={{ color: 'var(--accent-dynamic)' }} />
            Habilidades
          </h3>
          <button
            onClick={() => {
              setEditingSkill(null);
              setIsAddingSkill(!isAddingSkill);
            }}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nueva Habilidad
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAddingSkill && (
          <div className="mb-6 p-6 bg-white/5 border border-white/20 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg text-white">
                {editingSkill ? 'Editar Habilidad' : 'Nueva Habilidad'}
              </h4>
              <button
                onClick={handleCloseForm}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-300 mb-2">Categoría *</label>
              <select
                value={formData.category_id}
                onChange={(e) => {
                    setFormData({ ...formData, category_id: e.target.value });
                    setSelectedCategoryForNewSkill(e.target.value);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              >
                <option value="">Selecciona una categoría</option>
                {skillCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-2">Nombre de la Habilidad *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                placeholder="React / Next.js"
              />
            </div>

            {/* Level */}
            <div>
              <label className="text-gray-300 mb-2 flex justify-between">
                <span>Nivel de dominio</span>
                <span style={{ color: 'var(--accent-dynamic)' }}>{formData.level}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
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
                {editingSkill ? 'Actualizar Cambios' : 'Guardar Habilidad'}
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

        {/* Categories List */}
        <div className="space-y-8">
          {skillCategories.map((category) => (
            <div key={category.id} className="group">
              <div className="flex items-center gap-4 mb-4">
                <h4 className="text-lg font-semibold text-white/90">{category.name}</h4>
                <div className="h-px flex-1 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-all group/item"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white font-medium">{skill.name}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingSkill(skill)}
                          className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit size={16} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => skill.id && handleDeleteSkill(skill.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${skill.level}%`,
                              backgroundColor: 'var(--accent-dynamic)',
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 min-w-[30px]">{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};