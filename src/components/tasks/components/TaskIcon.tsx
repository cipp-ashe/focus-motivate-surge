
import React from 'react';
import { TaskType } from '@/types/tasks';
import { Timer, FileText, BookOpen, CheckSquare, Image, Mic, FileSpreadsheet } from 'lucide-react';
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
  // Apply color class based on task type, respecting dark mode
  const colorClass = muted 
    ? 'text-muted-foreground' 
    : `task-${taskType} dark:text-foreground`;
  
  // Determine which icon to render based on task type
  switch (taskType) {
    case 'timer':
      return <Timer className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'journal':
      return <BookOpen className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'checklist':
      return <CheckSquare className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'screenshot':
      return <Image className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'voicenote':
      return <Mic className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'focus':
      return <FileSpreadsheet className={cn(colorClass, className)} size={size} aria-hidden="true" />;
    case 'regular':
    default:
      return <FileText className={cn(colorClass, className)} size={size} aria-hidden="true" />;
  }
};

export default TaskIcon;
