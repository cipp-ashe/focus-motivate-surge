
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Upload, FileText, Timer, BookOpen, CheckSquare, Image, Mic } from "lucide-react";
import { TaskType } from '@/types/tasks';

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
 * Only includes the allowed task types
 */
const taskTypeIcons = {
  regular: <FileText className="h-4 w-4 text-primary" />,
  timer: <Timer className="h-4 w-4 text-purple-400" />,
  journal: <BookOpen className="h-4 w-4 text-amber-400" />,
  checklist: <CheckSquare className="h-4 w-4 text-cyan-400" />,
  screenshot: <Image className="h-4 w-4 text-blue-400" />,
  voicenote: <Mic className="h-4 w-4 text-rose-400" />
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
  voicenote: 'Voice Note'
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
  onToggleMultipleInput
}) => {
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
              className="absolute left-2 hover:bg-transparent"
            >
              {taskTypeIcons[taskType as keyof typeof taskTypeIcons] || taskTypeIcons.regular}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1 bg-background/95 backdrop-blur-sm border-border/50">
            <div className="space-y-1">
              {Object.entries(taskTypeIcons).map(([type, icon]) => (
                <Button
                  key={type}
                  variant={type === taskType ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 px-2"
                  onClick={() => handleTaskTypeSelect(type)}
                >
                  {icon}
                  <span className="text-sm">{taskTypeLabels[type as TaskType]}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={onTaskNameChange}
          ref={inputRef}
          className="flex-grow bg-background/20 dark:bg-[#1A1F2C] border-input/50 focus-visible:border-primary pl-12"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAddTask();
            }
          }}
        />
      </div>
      
      <Button 
        onClick={onAddTask}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        size="icon"
        aria-label="Add task"
      >
        <Send size={18} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onToggleMultipleInput}
        title="Bulk Import Tasks"
        className="border-input/50 hover:bg-accent"
        aria-label="Bulk import tasks"
      >
        <Upload size={18} />
      </Button>
    </div>
  );
};
