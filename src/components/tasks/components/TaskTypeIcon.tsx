
import React from 'react';
import { Timer, FileText, Image, Mic, CheckSquare, FileSpreadsheet } from 'lucide-react';
import { TaskType } from '@/types/tasks';

interface TaskTypeIconProps {
  taskType?: TaskType;
}

export const TaskTypeIcon: React.FC<TaskTypeIconProps> = ({ taskType }) => {
  switch (taskType) {
    case 'timer':
      return <Timer className="h-4 w-4 text-purple-500" aria-hidden="true" />;
    case 'journal':
      return <FileText className="h-4 w-4 text-blue-500" aria-hidden="true" />;
    case 'screenshot':
      return <Image className="h-4 w-4 text-green-500" aria-hidden="true" />;
    case 'voicenote':
      return <Mic className="h-4 w-4 text-red-500" aria-hidden="true" />;
    case 'checklist':
      return <CheckSquare className="h-4 w-4 text-amber-500" aria-hidden="true" />;
    default:
      return <FileSpreadsheet className="h-4 w-4 text-gray-400" aria-hidden="true" />;
  }
};
