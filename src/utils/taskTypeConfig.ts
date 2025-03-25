
import { 
  Clipboard, Timer, Image, BookOpen, CheckSquare, 
  Folder, PenTool, LayoutGrid, RefreshCw 
} from 'lucide-react';
import { TaskType } from '@/types/tasks';

export const TASK_TYPE_DEFINITIONS = [
  {
    type: 'standard' as TaskType,
    icon: Clipboard,
    label: 'Standard Task',
    description: 'Basic task',
    color: { 
      icon: 'text-blue-500',
      button: 'bg-blue-500/10 hover:bg-blue-500/20'
    }
  },
  {
    type: 'timer' as TaskType,
    icon: Timer,
    label: 'Timer Task',
    description: 'Task with timer',
    color: {
      icon: 'text-purple-500',
      button: 'bg-purple-500/10 hover:bg-purple-500/20'
    }
  },
  {
    type: 'journal' as TaskType,
    icon: BookOpen,
    label: 'Journal Entry',
    description: 'Journal task',
    color: {
      icon: 'text-teal-500',
      button: 'bg-teal-500/10 hover:bg-teal-500/20'
    }
  },
  {
    type: 'checklist' as TaskType,
    icon: CheckSquare,
    label: 'Checklist',
    description: 'Task with subtasks',
    color: {
      icon: 'text-amber-500',
      button: 'bg-amber-500/10 hover:bg-amber-500/20'
    }
  },
  {
    type: 'project' as TaskType,
    icon: Folder,
    label: 'Project',
    description: 'Project task',
    color: {
      icon: 'text-indigo-500',
      button: 'bg-indigo-500/10 hover:bg-indigo-500/20'
    }
  },
  {
    type: 'screenshot' as TaskType,
    icon: Image,
    label: 'Screenshot',
    description: 'Screenshot task',
    color: {
      icon: 'text-green-500',
      button: 'bg-green-500/10 hover:bg-green-500/20'
    }
  },
  {
    type: 'voicenote' as TaskType,
    icon: PenTool,
    label: 'Voice Note',
    description: 'Voice note task',
    color: {
      icon: 'text-red-500',
      button: 'bg-red-500/10 hover:bg-red-500/20'
    }
  },
  {
    type: 'habit' as TaskType,
    icon: LayoutGrid,
    label: 'Habit',
    description: 'Habit task',
    color: {
      icon: 'text-emerald-500',
      button: 'bg-emerald-500/10 hover:bg-emerald-500/20'
    }
  },
  {
    type: 'recurring' as TaskType,
    icon: RefreshCw,
    label: 'Recurring',
    description: 'Recurring task',
    color: {
      icon: 'text-sky-500',
      button: 'bg-sky-500/10 hover:bg-sky-500/20'
    }
  }
];

export const getTaskTypeDefinition = (type: TaskType = 'standard') => {
  return TASK_TYPE_DEFINITIONS.find(def => def.type === type) || TASK_TYPE_DEFINITIONS[0];
};

export const getTaskIcon = (type: TaskType = 'standard') => {
  return getTaskTypeDefinition(type).icon;
};

export const getTaskTypeLabel = (type: TaskType = 'standard') => {
  return getTaskTypeDefinition(type).label;
};

export const getTaskColorClass = (type: TaskType = 'standard') => {
  const def = getTaskTypeDefinition(type);
  return {
    icon: def.color.icon,
    button: def.color.button
  };
};

