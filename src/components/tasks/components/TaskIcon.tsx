
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
  LayoutList 
} from 'lucide-react';
import { TaskType } from '@/types/tasks';

interface TaskIconProps {
  type?: TaskType;
  className?: string;
  size?: number;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ 
  type = 'regular', 
  className = '', 
  size = 16 
}) => {
  const iconProps = {
    className,
    size
  };
  
  switch (type) {
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
    case 'counter':
    case 'rating':
      return <LayoutList {...iconProps} />;
    default:
      return <CheckSquare {...iconProps} />;
  }
};
