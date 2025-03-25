
import React from 'react';
import {
  CheckSquare,
  Clock,
  Image,
  FileText,
  Mic,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { TaskType } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';

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
  const { getIconColorClass } = useTaskTypeColor();
  
  // Use type if provided, otherwise fall back to taskType
  const iconType = type || taskType || 'regular';

  // Get the appropriate color class based on task type
  const colorClass = getIconColorClass(iconType);
  const iconProps = {
    className: cn(className, colorClass),
    size,
    'aria-hidden': true,
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
    case 'checklist':
      return <CheckSquare {...iconProps} />;
    case 'habit':
      return <Zap {...iconProps} />; // Using Zap for habits to show they're different
    case 'standard':
    case 'regular':
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
    case 'checklist':
      return 'Checklist';
    case 'habit':
      return 'Habit';
    case 'standard':
    case 'regular':
    default:
      return 'Task';
  }
};
