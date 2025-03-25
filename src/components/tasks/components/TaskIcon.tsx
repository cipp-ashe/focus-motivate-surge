
import React from 'react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { getTaskTypeDefinition } from '@/utils/taskTypeConfig';

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
  const definition = getTaskTypeDefinition(type);
  const IconComponent = definition.icon;
  
  return (
    <IconComponent 
      className={cn(className, definition.color.icon)} 
      size={size} 
      aria-hidden="true" 
    />
  );
};

