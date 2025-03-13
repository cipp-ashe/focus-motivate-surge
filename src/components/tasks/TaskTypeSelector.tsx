
import React, { useState } from 'react';
import { TaskType } from '@/types/tasks';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskIcon from './components/TaskIcon';

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
 * Task type information including labels
 */
const taskTypes: Array<{ type: TaskType; label: string }> = [
  { type: 'regular', label: 'Regular Task' },
  { type: 'timer', label: 'Focused Timer' },
  { type: 'journal', label: 'Journal Entry' },
  { type: 'checklist', label: 'Checklist' },
  { type: 'screenshot', label: 'Screenshot' },
  { type: 'voicenote', label: 'Voice Note' }
];

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
        {taskTypes.map(({ type, label }) => (
          <SelectItem key={type} value={type} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <TaskIcon taskType={type} size={16} />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
