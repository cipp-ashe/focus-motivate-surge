
import React from 'react';
import { Check, Clock, List, Maximize2, Mic, FileType, Star, Hash } from 'lucide-react';
import { Task, TaskType } from '@/types/tasks';

interface TaskIconProps {
  taskType?: TaskType;
  className?: string;
  size?: number;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ 
  taskType = 'regular', 
  className = '', 
  size = 16 
}) => {
  // Select icon based on task type
  let IconComponent;
  
  switch (taskType) {
    case 'timer':
      IconComponent = Clock;
      break;
    case 'checklist':
      IconComponent = List;
      break;
    case 'screenshot':
      IconComponent = Maximize2;
      break;
    case 'voicenote':
      IconComponent = Mic;
      break;
    case 'journal':
      IconComponent = FileType;
      break;
    case 'counter':
      IconComponent = Hash;
      break;
    case 'rating':
      IconComponent = Star;
      break;
    case 'regular':
    default:
      IconComponent = Check;
      break;
  }
  
  return <IconComponent size={size} className={className} />;
};

export const getTaskTypeLabel = (taskType?: TaskType): string => {
  switch (taskType) {
    case 'timer':
      return 'Timer';
    case 'checklist':
      return 'Checklist';
    case 'screenshot':
      return 'Screenshot';
    case 'journal':
      return 'Journal';
    case 'voicenote':
      return 'Voice Note';
    case 'counter':
      return 'Counter';
    case 'rating':
      return 'Rating';
    case 'regular':
    default:
      return 'Regular';
  }
};
