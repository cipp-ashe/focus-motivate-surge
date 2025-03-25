
import React from 'react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { getTaskIcon, getTaskLabel, getTaskColorClass } from '@/utils/taskTypeConfig';

export interface TaskIconProps {
  type?: TaskType;
  taskType?: TaskType; // Added for backward compatibility
  className?: string;
  size?: number;
}

export const TaskIcon: React.FC<TaskIconProps> = ({
  type,
  taskType,
  className = '',
  size = 16,
}) => {
  // Use type if provided, otherwise fall back to taskType
  const iconType = type || taskType || 'regular';

  // Get the appropriate color class based on task type
  const colorClass = getTaskColorClass(iconType, 'icon');
  
  // Clone the icon with the right properties
  const icon = React.cloneElement(
    getTaskIcon(iconType) as React.ReactElement,
    {
      className: cn(className, colorClass),
      size,
      'aria-hidden': true,
    }
  );

  return icon;
};

// Export the getTaskTypeLabel function from our centralized config
export const getTaskTypeLabel = getTaskLabel;
