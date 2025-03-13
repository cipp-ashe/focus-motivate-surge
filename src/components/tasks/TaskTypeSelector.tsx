
import React, { useState } from 'react';
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
  FileText, 
  BookOpen, 
  CheckSquare,
  Image,
  Mic
} from 'lucide-react';

/**
 * Props for the TaskTypeSelector component
 * @interface TaskTypeSelectorProps
 * @property {TaskType} value - The currently selected task type
 * @property {function} onChange - Callback function when task type changes
 */
interface TaskTypeSelectorProps {
  value: TaskType;
  onChange: (value: TaskType) => void;
}

/**
 * A component that renders a dropdown for selecting task types
 * 
 * This component provides a visual selector for different task types, each with
 * its own icon and label. It handles internal open/close state and calls the provided
 * onChange handler when a selection is made.
 * 
 * @param {TaskTypeSelectorProps} props - Component props
 * @returns {JSX.Element} A select dropdown for task types
 */
export const TaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleChange = (newValue: string) => {
    onChange(newValue as TaskType);
    setIsOpen(false); // Close the select after selection
  };

  return (
    <Select value={value} onValueChange={handleChange} open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select task type" />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
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
        <SelectItem value="screenshot">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-blue-400" />
            <span>Screenshot</span>
          </div>
        </SelectItem>
        <SelectItem value="voicenote">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-rose-400" />
            <span>Voice Note</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
