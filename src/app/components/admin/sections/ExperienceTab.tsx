// src/app/components/admin/sections/ExperienceTab.tsx
import { useState, useEffect } from 'react';
import type { Experience } from '../../../lib/types';
import { uploadImage } from '../../../lib/services';
import { Trash2, Plus, Save, Edit, X, Upload, Briefcase, GraduationCap } from 'lucide-react';

interface ExperienceTabProps {
  experiences: Experience[];
  editingExperience: Experience | null;
  setEditingExperience: (exp: Experience | null) => void;
  isAddingExperience: boolean;
  setIsAddingExperience: (value: boolean) => void;
  handleSaveExperience: (exp: Experience) => void;
  handleDeleteExperience: (id: string) => void;
}

export const ExperienceTab = ({
  experiences,
  editingExperience,
  setEditingExperience,
  isAddingExperience,
  setIsAddingExperience,
  handleSaveExperience,
  handleDeleteExperience,
}: ExperienceTabProps) => {
  const [formData, setFormData] = useState<Partial<Experience>>({
    type: 'work',
    title: '',
    company: '',
    period: '',
    location: '',
    description: '',
    technologies: [],
    image_url: '',
    order_position: experiences.length + 1,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editLang, setEditLang] = useState<'es' | 'en'>('es');

  // --- SOLUCIÓN AL ERROR: Sincronizar formData cuando entramos en modo edición ---
  useEffect(() => {
    if (editingExperience) {
      setFormData(editingExperience);
      setIsAddingExperience(true);
    } else {
      setFormData({
        type: 'work',
        title: '',
        company: '',
        period: '',
        location: '',
        description: '',
        technologies: [],
        image_url: '',
        order_position: experiences.length + 1,
      });
    }
  }, [editingExperience, setIsAddingExperience, experiences.length]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file, 'experiences');
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.company || !formData.period) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    handleSaveExperience(formData as Experience);
    
    // Resetear estados después de guardar
    setEditingExperience(null);
    setIsAddingExperience(false);
  };

  const handleCancel = () => {
    setEditingExperience(null);
    setIsAddingExperience(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl flex items-center gap-2">
            <Briefcase size={24} style={{ color: 'var(--accent-dynamic)' }} />
            Experiencias ({experiences.length})
          </h3>
          <button
            onClick={() => {
              setEditingExperience(null);
              setIsAddingExperience(true);
            }}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nueva Experiencia
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAddingExperience && (
          <div className="mb-6 p-6 bg-white/5 border border-white/20 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg text-white">
                {editingExperience ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </h4>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Language Toggle */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit">
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

            {/* Type */}
            <div>
              <label className="block text-gray-300 mb-2">Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'work' | 'education' })}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/20 rounded-lg text-white"
              >
                <option value="work">Trabajo</option>
                <option value="education">Educación</option>
              </select>
            </div>

            {/* Title & Company */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Título * {editLang === 'en' && '(English)'}
                </label>
                <input
                  type="text"
                  value={editLang === 'es' ? (formData.title || '') : (formData.title_en || '')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [editLang === 'es' ? 'title' : 'title_en']: e.target.value 
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder={editLang === 'es' ? 'Desarrollador Full Stack' : 'Full Stack Developer'}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  {formData.type === 'work' ? 'Empresa' : 'Institución'} * {editLang === 'en' && '(English)'}
                </label>
                <input
                  type="text"
                  value={editLang === 'es' ? (formData.company || '') : (formData.company_en || '')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [editLang === 'es' ? 'company' : 'company_en']: e.target.value 
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="Nombre de la empresa/institución"
                />
              </div>
            </div>

            {/* Period & Location */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Período * {editLang === 'en' && '(English)'}
                </label>
                <input
                  type="text"
                  value={editLang === 'es' ? (formData.period || '') : (formData.period_en || '')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [editLang === 'es' ? 'period' : 'period_en']: e.target.value 
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder={editLang === 'es' ? '2022 - Presente' : '2022 - Present'}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Ubicación {editLang === 'en' && '(English)'}
                </label>
                <input
                  type="text"
                  value={editLang === 'es' ? (formData.location || '') : (formData.location_en || '')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    [editLang === 'es' ? 'location' : 'location_en']: e.target.value 
                  })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="Buenos Aires, Argentina"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2">
                Descripción {editLang === 'en' && '(English)'}
              </label>
              <textarea
                value={editLang === 'es' ? (formData.description || '') : (formData.description_en || '')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [editLang === 'es' ? 'description' : 'description_en']: e.target.value 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white h-24"
                placeholder={editLang === 'es' ? 'Describe tu experiencia...' : 'Describe your experience...'}
              />
            </div>

            {/* Technologies */}
            <div>
              <label className="block text-gray-300 mb-2">Tecnologías (separadas por coma)</label>
              <input
                type="text"
                value={formData.technologies?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-gray-300 mb-2">Imagen</label>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover mb-3 border border-white/20"
                />
              )}
              <div className="space-y-3">
                <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2 w-fit">
                  <Upload size={18} />
                  {uploadingImage ? 'Subiendo...' : 'Subir Imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    O pega una URL de imagen externa:
                  </label>
                  <input
                    type="url"
                    value={formData.image_url || ''}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500"
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-dynamic)',
                  boxShadow: '0 10px 40px var(--accent-dynamic-glow)',
                }}
              >
                <Save size={20} />
                {editingExperience ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {exp.type === 'work' ? (
                      <Briefcase size={18} className="text-blue-400" />
                    ) : (
                      <GraduationCap size={18} className="text-green-400" />
                    )}
                    <h4 className="text-white font-bold">{exp.title}</h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-2">{exp.period} • {exp.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingExperience(exp)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Edit size={18} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => exp.id && handleDeleteExperience(exp.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};