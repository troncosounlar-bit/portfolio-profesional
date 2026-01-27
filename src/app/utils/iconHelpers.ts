import { Clock, Folder, Code, Eye, Award, User, Briefcase, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const iconOptions: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'clock', label: 'Reloj', icon: Clock },
  { value: 'folder', label: 'Carpeta', icon: Folder },
  { value: 'code', label: 'Código', icon: Code },
  { value: 'eye', label: 'Ojo', icon: Eye },
  { value: 'award', label: 'Premio', icon: Award },
  { value: 'user', label: 'Usuario', icon: User },
  { value: 'briefcase', label: 'Maletín', icon: Briefcase },
  { value: 'sparkles', label: 'Estrellas', icon: Sparkles },
];

export const getIconComponent = (iconName: string): LucideIcon => {
  const option = iconOptions.find((opt) => opt.value.toLowerCase() === iconName.toLowerCase());
  return option ? option.icon : Code;
};