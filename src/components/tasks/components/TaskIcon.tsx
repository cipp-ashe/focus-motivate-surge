import React from 'react';
import {
  CheckSquare,
  Clock,
  Image,
  FileText,
  Mic,
  Focus,
  CheckCircle2,
  ClipboardList,
  LayoutList,
} from 'lucide-react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';

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
  const getColorClass = (type: string): string => {
    switch (type) {
      case 'timer':
        return 'task-icon-timer';
      case 'journal':
        return 'task-icon-journal';
      case 'checklist':
        return 'task-icon-checklist';
      case 'screenshot':
        return 'task-icon-screenshot';
      case 'voicenote':
        return 'task-icon-voicenote';
      case 'focus':
        return 'task-icon-focus';
      default:
        return '';
    }
  };

  const colorClass = getColorClass(iconType);
  const iconProps = {
    className: cn(className, colorClass),
    size,
  };

  switch (iconType) {
    case 'timer':
      return <Clock {...iconProps} />;
    case 'screenshot':
      return <Image {...iconProps} />;
    case 'journal':
      return <FileText {...iconProps} />;
    case 'voicenote':
      return <Mic {...iconProps} />;
    case 'focus':
      return <Focus {...iconProps} />;
    case 'checklist':
      return <ClipboardList {...iconProps} />;
    case 'habit':
      return <CheckCircle2 {...iconProps} />;
    default:
      return <CheckSquare {...iconProps} />;
  }
};

export const getTaskTypeLabel = (type: TaskType): string => {
  switch (type) {
    case 'timer':
      return 'Timer';
    case 'screenshot':
      return 'Screenshot';
    case 'journal':
      return 'Journal';
    case 'voicenote':
      return 'Voice Note';
    case 'focus':
      return 'Focus';
    case 'checklist':
      return 'Checklist';
    case 'habit':
      return 'Habit';
    default:
      return 'Task';
  }
};
