
import React, { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Timer, MoreHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/types/tasks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd?: (tasks: Task[]) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd, onTasksAdd }) => {
  const [taskName, setTaskName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const taskManager = useUnifiedTaskManager();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      name: taskName.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      taskType: 'regular'
    };
    
    onTaskAdd(newTask);
    setTaskName('');
    
    // Set focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  
  const handleAddTimerTask = useCallback(() => {
    if (!taskName.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      name: taskName.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      taskType: 'timer',
      duration: 25 * 60 // Default 25 minutes
    };
    
    onTaskAdd(newTask);
    setTaskName('');
    
    // Set focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [taskName, onTaskAdd]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Add a new task..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" type="button" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleAddTimerTask}>
              <Timer className="mr-2 h-4 w-4" />
              Add as Timer Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button type="submit" size="icon">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
