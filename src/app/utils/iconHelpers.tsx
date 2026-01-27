import {
  Calendar,
  CheckCircle,
  Code,
  Star,
  Eye,
  Code2,
  Users,
  Rocket,
  Heart,
  LucideIcon,
} from 'lucide-react';

// Mapa de iconos disponibles
const iconMap: Record<string, LucideIcon> = {
  Calendar,
  CheckCircle,
  Code,
  Star,
  Eye,
  Code2,
  Users,
  Rocket,
  Heart,
};

// Opciones de iconos para selectores
export const iconOptions = [
  { value: 'Calendar', label: '📅 Calendario', icon: Calendar },
  { value: 'CheckCircle', label: '✅ Check', icon: CheckCircle },
  { value: 'Code', label: '💻 Código', icon: Code },
  { value: 'Star', label: '⭐ Estrella', icon: Star },
  { value: 'Eye', label: '👁️ Ojo', icon: Eye },
  { value: 'Code2', label: '🔧 Code2', icon: Code2 },
  { value: 'Users', label: '👥 Usuarios', icon: Users },
  { value: 'Rocket', label: '🚀 Cohete', icon: Rocket },
  { value: 'Heart', label: '❤️ Corazón', icon: Heart },
];

// Función para obtener el componente de icono
export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Code; // Default a Code si no se encuentra
};
