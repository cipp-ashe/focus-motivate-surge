
import React from 'react';
import { TaskType } from '@/types/tasks';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskIcon from './TaskIcon';

interface TaskTypeSelectorProps {
  value: TaskType;
  onChange: (value: TaskType) => void;
  showIntegratedTypes?: boolean;
}

/**
 * Task type definitions with icons and labels
 */
const taskTypes: Array<{ type: TaskType; label: string; category: 'standard' | 'integrated' }> = [
  // Standard types
  { type: 'regular', label: 'Regular Task', category: 'standard' },
  { type: 'checklist', label: 'Checklist', category: 'standard' },
  { type: 'counter', label: 'Counter', category: 'standard' },
  { type: 'rating', label: 'Rating', category: 'standard' },
  
  // Integrated types
  { type: 'timer', label: 'Focus Timer', category: 'integrated' },
  { type: 'journal', label: 'Journal Entry', category: 'integrated' },
  { type: 'screenshot', label: 'Screenshot', category: 'integrated' },
  { type: 'voicenote', label: 'Voice Note', category: 'integrated' }
];

/**
 * A redesigned component for selecting task types based on our new 
 * unified type system categorizing tasks as standard or integrated.
 */
export const NewTaskTypeSelector: React.FC<TaskTypeSelectorProps> = ({
  value,
  onChange,
  showIntegratedTypes = true
}) => {
  // Filter types based on whether to show integrated types
  const filteredTypes = taskTypes.filter(type => 
    showIntegratedTypes || type.category === 'standard'
  );
  
  return (
    <Select value={value} onValueChange={(val) => onChange(val as TaskType)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select task type">
          <div className="flex items-center gap-2">
            <TaskIcon taskType={value} size={16} />
            <span>{taskTypes.find(t => t.type === value)?.label || 'Select task type'}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
        {filteredTypes.map(({ type, label, category }) => (
          <SelectItem key={type} value={type} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <TaskIcon taskType={type} size={16} />
              <span>{label}</span>
              {category === 'integrated' && (
                <span className="text-xs bg-primary/10 text-primary px-1 rounded">
                  Integrated
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NewTaskTypeSelector;
