
import React from 'react';
import { TaskType } from "@/types/tasks";
import { Sparkles, Clock, BookOpen, ImageIcon, CheckSquare, Mic } from "lucide-react";

interface TaskIconProps {
  taskType?: TaskType;
  className?: string;
}

export const TaskIcon: React.FC<TaskIconProps> = ({ taskType, className = "h-4 w-4" }) => {
  switch(taskType) {
    case 'timer':
      return <Clock className={`${className} text-purple-400`} />;
    case 'screenshot':
      return <ImageIcon className={`${className} text-blue-400`} />;
    case 'journal':
      return <BookOpen className={`${className} text-amber-400`} />;
    case 'checklist':
      return <CheckSquare className={`${className} text-cyan-400`} />;
    case 'voicenote':
      return <Mic className={`${className} text-rose-400`} />;
    default:
      return <Sparkles className={`${className} text-primary`} />;
  }
};
