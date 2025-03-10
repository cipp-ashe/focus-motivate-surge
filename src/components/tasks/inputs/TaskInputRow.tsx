
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Upload } from "lucide-react";
import { TaskTypeSelector } from '../TaskTypeSelector';
import { TaskType } from '@/types/tasks';

interface TaskInputRowProps {
  taskName: string;
  taskType: TaskType;
  onTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaskTypeChange: (value: string) => void;
  onAddTask: () => void;
  onToggleMultipleInput: () => void;
}

export const TaskInputRow: React.FC<TaskInputRowProps> = ({
  taskName,
  taskType,
  onTaskNameChange,
  onTaskTypeChange,
  onAddTask,
  onToggleMultipleInput
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter task name"
        value={taskName}
        onChange={onTaskNameChange}
        ref={inputRef}
        className="flex-grow bg-background/50 border-input/50 focus-visible:border-primary"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onAddTask();
          }
        }}
      />
      
      <div className="flex-shrink-0 w-[140px]">
        <TaskTypeSelector 
          value={taskType} 
          onChange={onTaskTypeChange} 
        />
      </div>
      
      <Button 
        onClick={onAddTask}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        size="icon"
      >
        <Send size={18} />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onToggleMultipleInput}
        title="Bulk Import Tasks"
        className="border-input/50 hover:bg-accent"
      >
        <Upload size={18} />
      </Button>
    </div>
  );
};
