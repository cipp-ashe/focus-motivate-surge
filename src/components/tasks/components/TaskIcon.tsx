
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
 * Color mapping for each task type
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
  
  // Determine which icon to render based on task type
  switch (taskType) {
    case 'timer':
      return <Timer className={cn(colorClass, className)} size={size} />;
    case 'journal':
      return <BookOpen className={cn(colorClass, className)} size={size} />;
    case 'checklist':
      return <CheckSquare className={cn(colorClass, className)} size={size} />;
    case 'screenshot':
      return <Image className={cn(colorClass, className)} size={size} />;
    case 'voicenote':
      return <Mic className={cn(colorClass, className)} size={size} />;
    case 'regular':
    default:
      return <FileText className={cn(colorClass, className)} size={size} />;
  }
};

export default TaskIcon;
