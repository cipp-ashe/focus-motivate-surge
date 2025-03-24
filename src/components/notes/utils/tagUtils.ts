
import { TagColor } from '@/types/notes';

export const TAG_COLORS: TagColor[] = [
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink'
];

export const getNextColor = (currentColor: TagColor): TagColor => {
  const currentIndex = TAG_COLORS.indexOf(currentColor);
  return TAG_COLORS[(currentIndex + 1) % TAG_COLORS.length];
};

export const getTagStyles = (color: TagColor) => {
  const styles: Record<TagColor, string> = {
    default: 'bg-primary/5 hover:bg-primary/10 text-primary/80 hover:text-primary',
    red: 'bg-red-500/10 hover:bg-red-500/20 text-red-500/80 hover:text-red-500',
    orange: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500/80 hover:text-orange-500',
    yellow: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500/80 hover:text-yellow-500',
    green: 'bg-green-500/10 hover:bg-green-500/20 text-green-500/80 hover:text-green-500',
    blue: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500/80 hover:text-blue-500',
    purple: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-500/80 hover:text-purple-500',
    pink: 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-500/80 hover:text-pink-500',
    teal: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-500/80 hover:text-teal-500',
    cyan: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500/80 hover:text-cyan-500',
    indigo: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500/80 hover:text-indigo-500',
    gray: 'bg-gray-500/10 hover:bg-gray-500/20 text-gray-500/80 hover:text-gray-500'
  };
  return styles[color];
};
