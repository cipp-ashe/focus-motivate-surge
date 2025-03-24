import React, { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusCircle, Timer, FileText, CheckSquare, BookOpen, Mic } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskType } from '@/types/tasks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';
import { useEffect, useRef as useReactRef } from 'react';

// Debug logging
console.log('TaskInput component loaded');

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd?: (tasks: Task[]) => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onTaskAdd, onTasksAdd }) => {
  console.log('TaskInput component rendered with props:', { onTaskAdd, onTasksAdd });
  const [taskName, setTaskName] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>('regular');
  const inputRef = useRef<HTMLInputElement>(null);
  const taskManager = useUnifiedTaskManager();
  const renderCountRef = useReactRef({ count: 0 });

  // Debug re-renders
  useEffect(() => {
    renderCountRef.current.count++;
    console.log(`TaskInput re-render count: ${renderCountRef.current.count}`);
    console.log('Current taskType:', taskType);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      name: taskName.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      taskType: taskType,
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
      taskType: 'timer' as TaskType,
      duration: 25 * 60, // Default 25 minutes
    };

    onTaskAdd(newTask);
    setTaskName('');

    // Set focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [taskName, onTaskAdd]);

  // Task type icons and labels
  const taskTypeIcons = {
    regular: <FileText />,
    timer: <Timer />,
    journal: <BookOpen />,
    checklist: <CheckSquare />,
  };

  const taskTypeLabels = {
    regular: 'Regular Task',
    timer: 'Timer Task',
    journal: 'Journal Entry',
    checklist: 'Checklist',
  };

  const handleTaskTypeChange = (type: TaskType) => {
    setTaskType(type);
    setIsPopoverOpen(false); // Close the popover after selection
  };

  // Helper function to get background color based on task type
  const getTaskTypeBackground = (type: TaskType): string => {
    switch (type) {
      case 'timer':
        return 'hsla(var(--timer), 0.2)';
      case 'journal':
        return 'hsla(var(--journal), 0.2)';
      case 'checklist':
        return 'hsla(var(--checklist), 0.2)';
      case 'screenshot':
        return 'hsla(var(--screenshot), 0.2)';
      case 'voicenote':
        return 'hsla(var(--voicenote), 0.2)';
      case 'focus':
        return 'hsla(var(--focus), 0.2)';
      default:
        return 'transparent';
    }
  };

  // Helper function to get icon color class based on task type
  const getTaskIconClass = (type: TaskType): string => {
    switch (type) {
      case 'regular':
        return 'task-icon-regular';
      case 'timer':
        return 'task-icon-timer';
      case 'journal':
        return 'task-icon-journal';
      case 'checklist':
        return 'task-icon-checklist';
      case 'screenshot':
        return 'task-icon-screenshot';
      case 'voicenote':
        return 'task-icon-voicenote';
      default:
        return 'task-icon-regular';
    }
  };

  // Get the color for the current task type
  // Using global CSS classes instead of the hook

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex gap-2 w-full items-center">
        <div className="relative flex-1 flex items-center">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setIsPopoverOpen(!isPopoverOpen);
                }}
                variant="ghost"
                size="sm"
                className={`absolute left-0 z-10 h-full rounded-r-none border-r-0 ${getTaskIconClass(
                  taskType
                )}`}
                aria-label={`Select task type: ${taskType}`}
              >
                <span className={getTaskIconClass(taskType)}>
                  {taskTypeIcons[taskType as keyof typeof taskTypeIcons] || taskTypeIcons.regular}
                  <span className="hidden">
                    {/* Log task type icon class */}
                    {(() => {
                      console.log(`Task type icon button class: ${getTaskIconClass(taskType)}`);
                      return null;
                    })()}
                  </span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-full max-w-[300px] sm:max-w-[350px] p-2 shadow-lg border border-border"
              onOpenAutoFocus={(e) => {
                console.log('PopoverContent classes:', (e.currentTarget as HTMLElement).className);
                const computedStyle = window.getComputedStyle(e.currentTarget as HTMLElement);
                const borderColor = computedStyle.borderColor;
                console.log('PopoverContent background:', computedStyle.backgroundColor);
                console.log('PopoverContent color:', computedStyle.color);
                console.log('PopoverContent border color:', borderColor);
                console.log('PopoverContent border width:', computedStyle.borderWidth);
                console.log('PopoverContent border style:', computedStyle.borderStyle);

                // Check if the border-border class is applied correctly
                const borderColorValue = getComputedStyle(
                  document.documentElement
                ).getPropertyValue('--border');
                const expectedBorderColor = `hsl(${borderColorValue})`;
                console.log('Expected border color (hsl):', expectedBorderColor);

                // Check CSS variables
                console.log(
                  '--popover CSS variable:',
                  getComputedStyle(document.documentElement).getPropertyValue('--popover')
                );
                console.log(
                  '--border CSS variable:',
                  getComputedStyle(document.documentElement).getPropertyValue('--border')
                );
                console.log(
                  '--popover-foreground CSS variable:',
                  getComputedStyle(document.documentElement).getPropertyValue(
                    '--popover-foreground'
                  )
                );
                console.log(
                  'bg-popover class:',
                  computedStyle.getPropertyValue('background-color')
                );
                console.log(
                  'Document theme class:',
                  document.documentElement.classList.contains('dark') ? 'dark' : 'light'
                );
                // Check task type icon colors
                console.log(
                  '--timer CSS variable:',
                  getComputedStyle(document.documentElement).getPropertyValue('--timer')
                );
                console.log(
                  '--journal CSS variable:',
                  getComputedStyle(document.documentElement).getPropertyValue('--journal')
                );
                console.log(
                  '--checklist CSS variable:',
                  getComputedStyle(document.documentElement).getPropertyValue('--checklist')
                );

                // Check if the task type icons have the correct color
                const timerIcon = document.querySelector('.task-icon-timer');
                console.log(
                  'Timer icon color:',
                  timerIcon ? getComputedStyle(timerIcon).color : 'Not found'
                );
              }}
            >
              <div className="flex flex-col gap-1 w-full">
                {Object.entries(taskTypeIcons).map(([type, icon]) => {
                  console.log('Rendering task type option:', type);
                  return (
                    <Button
                      key={type}
                      variant={type === taskType ? 'secondary' : 'ghost'}
                      onClick={() => handleTaskTypeChange(type as TaskType)}
                      style={
                        type === taskType
                          ? { backgroundColor: getTaskTypeBackground(type as TaskType) }
                          : { backgroundColor: 'transparent' }
                      }
                      className={`flex items-center gap-3 w-full p-2 justify-start transition-colors hover:bg-secondary/50 ${getTaskIconClass(
                        type as TaskType
                      )}`}
                    >
                      <span className={getTaskIconClass(type as TaskType)}>{icon}</span>
                      <span className="text-sm">
                        {type === 'regular'
                          ? 'Regular'
                          : taskTypeLabels[type as keyof typeof taskTypeLabels]}
                      </span>
                      <span className="hidden">
                        {/* Log button class */}
                        {(() => {
                          console.log(
                            `Button for ${type} task type - applied class: ${getTaskIconClass(
                              type as TaskType
                            )}`
                          );
                          return null;
                        })()}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Add a new task..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 h-10 rounded-md border border-input focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button
          type="submit"
          size="icon"
          className="flex-shrink-0 bg-primary hover:bg-primary/90 transition-colors shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
