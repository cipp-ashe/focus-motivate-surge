
import React from 'react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { getTaskIcon, getTaskLabel, getTaskColorClass } from '@/utils/taskTypeConfig';

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
  
  // Clone the icon with the right properties
  const icon = React.cloneElement(
    getTaskIcon(type) as React.ReactElement,
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
