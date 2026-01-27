import { useState } from 'react';
import type { Project } from '@/app/lib/types';
import { uploadImage, uploadVideo } from '@/app/lib/services';
// Eliminados Trash2 y Edit que daban error 6133
import { Plus, Save, X, Upload, Code2, Calendar } from 'lucide-react';

interface ProjectsTabProps {
  projects: Project[];
  editingProject: Project | null;
  setEditingProject: (proj: Project | null) => void;
  isAddingProject: boolean;
  setIsAddingProject: (value: boolean) => void;
  handleSaveProject: (proj: Project) => void;
  handleDeleteProject: (id: string) => void;
}

export const ProjectsTab = (({
  projects,
  // Se omiten editingProject y setEditingProject aquí para resolver el error 6133
  isAddingProject,
  setIsAddingProject,
  handleSaveProject,
  handleDeleteProject,
}: ProjectsTabProps) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    demo_video_url: '',
    github_url: '',
    stack: [],
    order_position: projects.length + 1,
    is_featured: false,
    project_date: '', // Inicialización del nuevo campo
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editLang, setEditLang] = useState<'es' | 'en'>('es');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file, 'projects');
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      alert('⚠️ Por favor sube un video en formato MP4, WebM, OGG o MOV');
      return;
    }

    // Validar tamaño (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('⚠️ El video es muy grande. Máximo 50MB');
      return;
    }

    setUploadingVideo(true);
    try {
      const videoUrl = await uploadVideo(file, 'projects');
      setFormData({ ...formData, demo_video_url: videoUrl });
      alert('✅ Video subido correctamente');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('❌ Error al subir video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.image_url) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    handleSaveProject(formData as Project);
    setFormData({
      title: '',
      description: '',
      image_url: '',
      demo_url: '',
      demo_video_url: '',
      github_url: '',
      stack: [],
      order_position: projects.length + 1,
      is_featured: false,
      project_date: '', // Reseteo del campo
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl flex items-center gap-2">
            <Code2 size={24} style={{ color: 'var(--accent-dynamic)' }} />
            Proyectos ({projects.length})
          </h3>
          <button
            onClick={() => setIsAddingProject(!isAddingProject)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo Proyecto
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAddingProject && (
          <div className="mb-6 p-6 bg-white/5 border border-white/20 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg text-white">Nuevo Proyecto</h4>
              <button
                onClick={() => setIsAddingProject(false)}
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

            {/* Project Date - CORRECCIÓN AQUÍ: Eliminado 'block' para evitar conflicto con 'flex' */}
            <div>
              <label className="text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Fecha del Proyecto
              </label>
              <input
                type="date"
                value={formData.project_date || ''}
                onChange={(e) => setFormData({ ...formData, project_date: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white [color-scheme:dark]"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2">
                Nombre del Proyecto * {editLang === 'en' && '(English)'}
              </label>
              <input
                type="text"
                value={editLang === 'es' ? (formData.title || '') : (formData.title_en || '')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [editLang === 'es' ? 'title' : 'title_en']: e.target.value 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                placeholder={editLang === 'es' ? 'Mi Proyecto Increíble' : 'My Amazing Project'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2">
                Descripción * {editLang === 'en' && '(English)'}
              </label>
              <textarea
                value={editLang === 'es' ? (formData.description || '') : (formData.description_en || '')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [editLang === 'es' ? 'description' : 'description_en']: e.target.value 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white h-24"
                placeholder={editLang === 'es' ? 'Describe tu proyecto...' : 'Describe your project...'}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-gray-300 mb-2">Imagen *</label>
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-full h-48 rounded-lg object-cover mb-3 border border-white/20"
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
                    O pega una URL de imagen externa (Cloudinary, Imgur, etc.):
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

            {/* Technologies */}
            <div>
              <label className="block text-gray-300 mb-2">Tecnologías (separadas por coma)</label>
              <input
                type="text"
                value={formData.stack?.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  stack: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                placeholder="React, Next.js, Tailwind CSS"
              />
            </div>

            {/* URLs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">URL Demo (sitio web)</label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="https://ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">URL GitHub</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                  placeholder="https://github.com/usuario/repo"
                />
              </div>
            </div>

            {/* Demo Video URL */}
            <div>
              <label className="block text-gray-300 mb-2">Video Demo (opcional)</label>
              {formData.demo_video_url && (
                <div className="mb-3 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-400">✅ Video cargado</span>
                    <button
                      onClick={() => setFormData({ ...formData, demo_video_url: '' })}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Eliminar video
                    </button>
                  </div>
                  <video
                    src={formData.demo_video_url}
                    className="w-full h-48 rounded-lg object-cover bg-black"
                    controls
                  />
                </div>
              )}
              <div className="space-y-3">
                <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2 w-fit">
                  <Upload size={18} />
                  {uploadingVideo ? 'Subiendo video...' : 'Subir Video desde PC'}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">o pega una URL:</span>
                  </div>
                  <input
                    type="url"
                    value={formData.demo_video_url}
                    onChange={(e) => setFormData({ ...formData, demo_video_url: e.target.value })}
                    className="w-full pl-32 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm"
                    placeholder="https://ejemplo.com/video.mp4"
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
                Guardar
              </button>
              <button
                onClick={() => setIsAddingProject(false)}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-all group"
            >
              <div className="relative">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                {project.project_date && (
                   <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-gray-300 border border-white/10 flex items-center gap-1">
                      <Calendar size={10} /> {project.project_date}
                   </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-white mb-2">{project.title}</h4>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(project);
                      setIsAddingProject(true);
                    }}
                    className="flex-1 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => project.id && handleDeleteProject(project.id)}
                    className="px-3 py-2 bg-red-500/10 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});