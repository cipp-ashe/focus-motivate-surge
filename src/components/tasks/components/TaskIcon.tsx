
import React from 'react';
import { TaskType } from '@/types/tasks';
import { Timer, FileText, BookOpen, CheckSquare, Image, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the TaskIcon component
 */
interface TaskIconProps {
  /** The type of task to display an icon for */
  taskType?: TaskType;
  /** Additional class names to apply to the icon */
  className?: string;
  /** Size of the icon in pixels (default: 16) */
  size?: number;
  /** Whether to show the icon in muted style */
  muted?: boolean;
}

/**
 * Color mapping for each task type using Tailwind classes
 * that respect the theme's color palette
 */
const taskTypeColors: Record<TaskType, string> = {
  regular: 'text-primary',
  timer: 'text-purple-400',
  journal: 'text-amber-400',
  checklist: 'text-cyan-400',
  screenshot: 'text-blue-400',
  voicenote: 'text-rose-400'
};

/**
 * Hover state color mapping for each task type
 */
const taskTypeHoverColors: Record<TaskType, string> = {
  regular: 'group-hover:text-primary/80',
  timer: 'group-hover:text-purple-600',
  journal: 'group-hover:text-amber-600',
  checklist: 'group-hover:text-cyan-600',
  screenshot: 'group-hover:text-blue-600',
  voicenote: 'group-hover:text-rose-600'
};

/**
 * A component that displays the appropriate icon for a task type
 * 
 * This component ensures consistent icon usage throughout the task system,
 * including consistent colors and styling for each task type.
 *
 * @param {TaskIconProps} props - The component props
 * @returns {JSX.Element} The icon appropriate for the given task type
 */
export const TaskIcon: React.FC<TaskIconProps> = ({ 
  taskType = 'regular',
  className,
  size = 16,
  muted = false
}) => {
  // Apply color class based on task type
  const colorClass = muted ? 'text-muted-foreground' : taskTypeColors[taskType];
  const hoverColorClass = !muted ? taskTypeHoverColors[taskType] : '';
  
  // Determine which icon to render based on task type
  switch (taskType) {
    case 'timer':
      return <Timer className={cn(colorClass, hoverColorClass, className)} size={size} />;
    case 'journal':
      return <BookOpen className={cn(colorClass, hoverColorClass, className)} size={size} />;
    case 'checklist':
      return <CheckSquare className={cn(colorClass, hoverColorClass, className)} size={size} />;
    case 'screenshot':
      return <Image className={cn(colorClass, hoverColorClass, className)} size={size} />;
    case 'voicenote':
      return <Mic className={cn(colorClass, hoverColorClass, className)} size={size} />;
    case 'regular':
    default:
      return <FileText className={cn(colorClass, hoverColorClass, className)} size={size} />;
  }
};

export default TaskIcon;
