
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Send, Upload, FileText, Timer, Image, BookOpen, CheckSquare, Mic, Zap } from "lucide-react";
import { TaskType } from '@/types/tasks';

interface TaskInputRowProps {
  taskName: string;
  taskType: TaskType;
  onTaskNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTaskTypeChange: (value: string) => void;
  onAddTask: () => void;
  onToggleMultipleInput: () => void;
}

const taskTypeIcons = {
  regular: <FileText className="h-4 w-4 text-primary" />,
  timer: <Timer className="h-4 w-4 text-purple-400" />,
  screenshot: <Image className="h-4 w-4 text-blue-400" />,
  journal: <BookOpen className="h-4 w-4 text-amber-400" />,
  checklist: <CheckSquare className="h-4 w-4 text-cyan-400" />,
  voicenote: <Mic className="h-4 w-4 text-rose-400" />,
  habit: <Zap className="h-4 w-4 text-green-400" />
};

const taskTypeLabels = {
  regular: 'Regular Task',
  timer: 'Focused Timer',
  screenshot: 'Image Task',
  journal: 'Journal Entry',
  checklist: 'Checklist',
  voicenote: 'Voice Note',
  habit: 'Habit'
};

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
      <div className="flex-grow relative flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 hover:bg-transparent"
            >
              {taskTypeIcons[taskType]}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1">
            <div className="space-y-1">
              {Object.entries(taskTypeIcons).map(([type, icon]) => (
                <Button
                  key={type}
                  variant={type === taskType ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 px-2"
                  onClick={() => onTaskTypeChange(type)}
                  disabled={type === 'habit'}
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
          className="flex-grow bg-background/50 border-input/50 focus-visible:border-primary pl-12"
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
