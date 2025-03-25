import React from 'react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';
import {
  getTaskTypeIcon,
  getTaskTypeLabel as getTaskLabel,
  getTaskColorClass,
} from '@/utils/taskTypeConfig';
import * as LucideIcons from 'lucide-react';

export interface TaskIconProps {
  type: TaskType;
  className?: string;
  size?: number;
}

export const TaskIcon: React.FC<TaskIconProps> = ({
  type = 'standard',
  className = '',
  size = 16,
}) => {
  // Get the appropriate color class based on task type
  const colorClass = getTaskColorClass(type, 'icon');

  // Get the icon name from the config
  const iconName = getTaskTypeIcon(type);

  // Convert the first character to uppercase and the rest to lowercase
  // e.g. 'check-circle' -> 'CheckCircle'
  const formattedIconName = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');

  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[formattedIconName];

  if (!IconComponent) {
    console.warn(`Icon not found: ${iconName} (${formattedIconName})`);
    // Fallback to a default icon
    return (
      <LucideIcons.HelpCircle
        className={cn(className, colorClass)}
        size={size}
        aria-hidden="true"
      />
    );
  }

  // Render the icon with the appropriate props
  return <IconComponent className={cn(className, colorClass)} size={size} aria-hidden="true" />;
};

// Export the getTaskTypeLabel function from our centralized config
export const getTaskTypeLabel = getTaskLabel;
