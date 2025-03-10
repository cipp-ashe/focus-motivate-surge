
import React from 'react';
import { TaskType } from '@/types/tasks';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Timer, 
  Image, 
  Calendar, 
  FileText, 
  CheckSquare, 
  BookOpen, 
  Mic,
  Zap
} from 'lucide-react';

interface TaskTypeSelectorProps {
  value: TaskType;
  onChange: (value: TaskType) => void;
}

export const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({
  value,
  onChange
}) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as TaskType);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select task type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="regular" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>Regular Task</span>
          </div>
        </SelectItem>
        <SelectItem value="timer">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-purple-400" />
            <span>Focused Timer</span>
          </div>
        </SelectItem>
        <SelectItem value="screenshot">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-blue-400" />
            <span>Image Task</span>
          </div>
        </SelectItem>
        <SelectItem value="journal">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span>Journal Entry</span>
          </div>
        </SelectItem>
        <SelectItem value="checklist">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-cyan-400" />
            <span>Checklist</span>
          </div>
        </SelectItem>
        <SelectItem value="voicenote">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-rose-400" />
            <span>Voice Note</span>
          </div>
        </SelectItem>
        <SelectItem value="habit" disabled>
          <div className="flex items-center gap-2 opacity-60">
            <Zap className="h-4 w-4 text-green-400" />
            <span>Habit (from templates only)</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
