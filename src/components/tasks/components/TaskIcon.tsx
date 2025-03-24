
import React from 'react';
import { TaskType } from '@/types/tasks';
import { 
  Timer, 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Image, 
  Mic, 
  BarChart3,
  FileSpreadsheet,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskIconProps {
  taskType?: TaskType;
  className?: string;
  size?: number;
  muted?: boolean;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ 
  taskType = 'regular',
  className,
  size = 16,
  muted = false
}) => {
  // Directly apply Tailwind classes for better dark mode support
  const getColorClass = () => {
    if (muted) return 'text-muted-foreground';
    
    // Manual color mapping to ensure proper dark mode visibility
    switch (taskType) {
      // Standard types
      case 'regular':
        return 'text-gray-700 dark:text-gray-300';
      case 'checklist':
        return 'text-sky-500 dark:text-sky-300';
      case 'counter':
        return 'text-amber-500 dark:text-amber-300';
      case 'rating':
        return 'text-yellow-500 dark:text-yellow-300';
        
      // Integrated types
      case 'timer':
        return 'text-violet-500 dark:text-violet-300';
      case 'journal':
        return 'text-green-500 dark:text-green-300';
      case 'screenshot':
        return 'text-blue-500 dark:text-blue-300';
      case 'voicenote':
        return 'text-rose-500 dark:text-rose-300';
        
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };
  
  // Determine which icon to render based on task type
  switch (taskType) {
    // Standard types
    case 'regular':
      return <FileText className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
    case 'checklist':
      return <CheckSquare className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
    case 'counter':
      return <BarChart3 className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
    case 'rating':
      return <Star className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
      
    // Integrated types
    case 'timer':
      return <Timer className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
    case 'journal':
      return <BookOpen className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
    case 'screenshot':
      return <Image className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
    case 'voicenote':
      return <Mic className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
      
    default:
      return <FileText className={cn(getColorClass(), className)} size={size} aria-hidden="true" />;
  }
};

export default TaskIcon;
