
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Upload, FileText, Timer, CheckSquare, Mic, Image } from 'lucide-react';
import { TaskType } from '@/types/tasks';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';

/**
 * Props for the TaskInputRow component
 * @interface TaskInputRowProps
 */
interface TaskInputRowProps {
  /** Current task name in the input field */
  taskName: string;
  /** Currently selected task type */
  taskType: TaskType;
  /** Callback when task name changes */
  onTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback when task type changes */
  onTaskTypeChange: (value: string) => void;
  /** Callback to add a new task */
  onAddTask: () => void;
  /** Callback to toggle multiple task input mode */
  onToggleMultipleInput: () => void;
}

/**
 * Map of task types to their corresponding icons
 * Only includes the allowed task types for creation via the input
 */
const taskTypeIcons = {
  regular: <CheckSquare className="h-4 w-4" />,
  timer: <Timer className="h-4 w-4" />,
  journal: <FileText className="h-4 w-4" />,
  checklist: <CheckSquare className="h-4 w-4" />,
  screenshot: <Image className="h-4 w-4" />,
  voicenote: <Mic className="h-4 w-4" />,
};

/**
 * Map of task types to their display labels
 */
const taskTypeLabels = {
  regular: 'Regular Task',
  timer: 'Focused Timer',
  journal: 'Journal Entry',
  checklist: 'Checklist',
  screenshot: 'Screenshot',
  voicenote: 'Voice Note',
};

/**
 * A component that renders an input row for creating new tasks
 *
 * This component handles the main task input UI, including:
 * - Text input for the task name
 * - Task type selector dropdown
 * - Add button
 * - Toggle for multiple task input mode
 *
 * @param {TaskInputRowProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
export const TaskInputRow: React.FC<TaskInputRowProps> = ({
  taskName,
  taskType,
  onTaskNameChange,
  onTaskTypeChange,
  onAddTask,
  onToggleMultipleInput,
}) => {
  const { getIconColorClass } = useTaskTypeColor();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleTaskTypeSelect = (type: string) => {
    onTaskTypeChange(type);
    setIsOpen(false); // Close the popover after selection
  };

  return (
    <div className="flex gap-2">
      <div className="flex-grow relative flex items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(getIconColorClass(taskType as TaskType))}
            >
              {taskTypeIcons[taskType as keyof typeof taskTypeIcons] || taskTypeIcons.regular}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-1 w-full">
              {Object.entries(taskTypeIcons).map(([type, icon]) => {
                const iconColorClass = getIconColorClass(type as TaskType);
                
                return (
                  <Button
                    key={type}
                    variant={type === taskType ? 'secondary' : 'ghost'}
                    onClick={() => handleTaskTypeSelect(type)}
                    className={cn(
                      "flex items-center gap-3 w-full p-2 justify-start",
                      type === taskType ? "bg-secondary" : "",
                      iconColorClass
                    )}
                  >
                    <span className={iconColorClass}>{icon}</span>
                    <span className="text-sm">{taskTypeLabels[type as TaskType]}</span>
                  </Button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={onTaskNameChange}
          ref={inputRef}
          className="flex-grow pl-12"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAddTask();
            }
          }}
        />
      </div>

      <Button onClick={onAddTask} size="icon" aria-label="Add task">
        <Send size={18} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMultipleInput}
        title="Bulk Import Tasks"
        aria-label="Bulk import tasks"
      >
        <Upload size={18} />
      </Button>
    </div>
  );
};
