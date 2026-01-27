import { useState, useEffect } from 'react';
import type { AboutData, WorkPhilosophy } from '@/app/lib/types';
import { uploadImage } from '@/app/lib/services';
import { Trash2, Plus, Save, Edit, X, Upload, LucideIcon } from 'lucide-react';

interface AboutTabProps {
  aboutData: AboutData;
  setAboutData: (data: AboutData) => void;
  workPhilosophy: WorkPhilosophy[];
  editingPhilosophy: WorkPhilosophy | null;
  setEditingPhilosophy: (phil: WorkPhilosophy | null) => void;
  isAddingPhilosophy: boolean;
  setIsAddingPhilosophy: (value: boolean) => void;
  saveAboutData: () => void;
  handleSavePhilosophy: (phil: WorkPhilosophy) => void;
  handleDeletePhilosophy: (id: string) => void;
  iconOptions: Array<{ value: string; label: string; icon: LucideIcon }>;
  getIconComponent: (iconName: string) => LucideIcon;
}

export const AboutTab = ({
  aboutData,
  setAboutData,
  workPhilosophy,
  editingPhilosophy,
  setEditingPhilosophy,
  isAddingPhilosophy,
  setIsAddingPhilosophy,
  saveAboutData,
  handleSavePhilosophy,
  handleDeletePhilosophy,
  iconOptions,
  getIconComponent,
}: AboutTabProps) => {
  const [philFormData, setPhilFormData] = useState<Partial<WorkPhilosophy>>({
    title: '',
    description: '',
    icon: 'code',
    order_position: workPhilosophy.length + 1,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editLang, setEditLang] = useState<'es' | 'en'>('es');
  const [philEditLang, setPhilEditLang] = useState<'es' | 'en'>('es');

  // ✅ SOLUCIÓN AL PROBLEMA: Sincronizar el formulario con el elemento en edición
  useEffect(() => {
    if (editingPhilosophy) {
      setPhilFormData(editingPhilosophy);
    } else {
      setPhilFormData({
        title: '',
        description: '',
        icon: 'code',
        order_position: workPhilosophy.length + 1,
      });
    }
  }, [editingPhilosophy, workPhilosophy.length]);

  // Validación: Si aboutData es undefined, usar valores por defecto
  const safeAboutData = aboutData || {
    id: '',
    description: '',
    description_en: '',
    image_url: ''
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file, 'about');
      setAboutData({ ...safeAboutData, image_url: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhilSubmit = () => {
    if (!philFormData.title || !philFormData.description) {
      alert('Por favor completa todos los campos');
      return;
    }

    handleSavePhilosophy(philFormData as WorkPhilosophy);
    
    // ✅ Limpiar estados después de guardar
    setEditingPhilosophy(null);
    setIsAddingPhilosophy(false);
  };

  // ✅ Nueva función para cancelar la edición de forma limpia
  const handleCancelPhilosophy = () => {
    setEditingPhilosophy(null);
    setIsAddingPhilosophy(false);
  };

  return (
    <div className="space-y-6">
      {/* About Description */}
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-xl mb-6 flex items-center gap-2">
          <Save size={24} style={{ color: 'var(--accent-dynamic)' }} />
          Acerca de Mí
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

        <div className="space-y-4">
          {/* Image */}
          <div>
            <label className="block text-gray-300 mb-2">Imagen</label>
            {safeAboutData.image_url && (
              <img
                src={safeAboutData.image_url}
                alt="About"
                className="w-48 h-48 rounded-lg object-cover mb-4 border border-white/20"
              />
            )}
            <div className="space-y-3">
              {/* Botón de subir archivo */}
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2">
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
                {safeAboutData.image_url && (
                  <button
                    onClick={() => setAboutData({ ...safeAboutData, image_url: '' })}
                    className="px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              
              {/* Input para URL externa */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  O pega una URL de imagen externa (Cloudinary, Imgur, etc.):
                </label>
                <input
                  type="url"
                  value={safeAboutData.image_url || ''}
                  onChange={(e) => setAboutData({ ...safeAboutData, image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 mb-2">
              Biografía {editLang === 'en' && '(English)'}
            </label>
            <textarea
              value={editLang === 'es' ? safeAboutData.description : (safeAboutData.description_en || '')}
              onChange={(e) => setAboutData({ 
                ...safeAboutData, 
                [editLang === 'es' ? 'description' : 'description_en']: e.target.value 
              })}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white h-48"
              placeholder={editLang === 'es' ? 'Escribe tu biografía aquí...' : 'Write your biography here...'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar saltos de línea para separar párrafos
            </p>
          </div>

          <button
            onClick={saveAboutData}
            className="w-full px-8 py-4 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--accent-dynamic)',
              boxShadow: '0 10px 40px var(--accent-dynamic-glow)',
            }}
          >
            <Save size={20} />
            Guardar Biografía
          </button>
        </div>
      </div>

      {/* Work Philosophy */}
      <div className="bg-black/60 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl flex items-center gap-2">
            <Save size={24} style={{ color: 'var(--accent-dynamic)' }} />
            Mi Filosofía de Trabajo ({workPhilosophy.length})
          </h3>
          <button
            onClick={() => {
              setEditingPhilosophy(null); // Asegurar que es nuevo
              setIsAddingPhilosophy(!isAddingPhilosophy);
            }}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Nuevo Valor
          </button>
        </div>

        {/* Add/Edit Form */}
        {isAddingPhilosophy && (
          <div className="mb-6 p-6 bg-white/5 border border-white/20 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg text-white">
                {editingPhilosophy ? 'Editar Valor' : 'Nuevo Valor'}
              </h4>
              <button
                onClick={handleCancelPhilosophy}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Language Toggle for Philosophy */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit">
              <button
                onClick={() => setPhilEditLang('es')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  philEditLang === 'es'
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇪🇸 Español
              </button>
              <button
                onClick={() => setPhilEditLang('en')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  philEditLang === 'en'
                    ? 'bg-white/20 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-300 mb-2">
                Título * {philEditLang === 'en' && '(English)'}
              </label>
              <input
                type="text"
                value={philEditLang === 'es' ? (philFormData.title || '') : (philFormData.title_en || '')}
                onChange={(e) => setPhilFormData({ 
                  ...philFormData, 
                  [philEditLang === 'es' ? 'title' : 'title_en']: e.target.value 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
                placeholder={philEditLang === 'es' ? 'Código Limpio' : 'Clean Code'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-2">
                Descripción * {philEditLang === 'en' && '(English)'}
              </label>
              <textarea
                value={philEditLang === 'es' ? (philFormData.description || '') : (philFormData.description_en || '')}
                onChange={(e) => setPhilFormData({ 
                  ...philFormData, 
                  [philEditLang === 'es' ? 'description' : 'description_en']: e.target.value 
                })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white h-24"
                placeholder={philEditLang === 'es' ? 'Escribo código mantenible y escalable...' : 'I write maintainable and scalable code...'}
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-gray-300 mb-2">Ícono</label>
              <select
                value={philFormData.icon}
                onChange={(e) => setPhilFormData({ ...philFormData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handlePhilSubmit}
                className="flex-1 px-6 py-3 rounded-lg text-white transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'var(--accent-dynamic)',
                  boxShadow: '0 10px 40px var(--accent-dynamic-glow)',
                }}
              >
                <Save size={20} />
                {editingPhilosophy ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                onClick={handleCancelPhilosophy}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Philosophy List */}
        <div className="grid gap-4">
          {workPhilosophy.map((phil) => {
            const IconComponent = getIconComponent(phil.icon);
            return (
              <div
                key={phil.id}
                className={`p-4 bg-white/5 border rounded-lg transition-all ${
                  editingPhilosophy?.id === phil.id 
                    ? 'border-accent-dynamic bg-white/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3 flex-1">
                    <div className="p-2 bg-white/5 rounded-lg h-fit">
                      <IconComponent size={20} style={{ color: 'var(--accent-dynamic)' }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white mb-1">{phil.title}</h4>
                      <p className="text-gray-400 text-sm">{phil.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPhilosophy(phil); // ✅ Usamos el setter de las props
                        setIsAddingPhilosophy(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Edit size={18} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => phil.id && handleDeletePhilosophy(phil.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};