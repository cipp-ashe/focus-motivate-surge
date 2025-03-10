
import React from 'react';
import { TaskType } from '@/types/tasks';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Timer, Image, Calendar, FileText } from 'lucide-react';

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
            <span>Timer Task</span>
          </div>
        </SelectItem>
        <SelectItem value="screenshot">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-blue-400" />
            <span>Screenshot Task</span>
          </div>
        </SelectItem>
        <SelectItem value="habit">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-400" />
            <span>Habit Task</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
