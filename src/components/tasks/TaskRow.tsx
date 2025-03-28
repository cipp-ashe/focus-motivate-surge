
import React, { useState, useEffect } from "react";
import { Task } from "@/types/tasks";
import { eventManager } from "@/lib/events/EventManager";
import { Card } from "@/components/ui/card";
import { TaskContent } from "./components/TaskContent";
import { useTaskTypeColor } from "@/hooks/useTaskTypeColor";
import { cn } from "@/lib/utils";

/**
 * Props for the TaskRow component
 */
interface TaskRowProps {
  /** The task this row represents */
  task: Task;
  /** Whether this task is currently selected */
  isSelected: boolean;
  /** ID of the task currently being edited, if any */
  editingTaskId: string | null;
  /** Callback when the task is clicked */
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  /** Callback when the task is deleted */
  onTaskDelete: (taskId: string) => void;
  /** Callback when the task duration is changed */
  onDurationChange: (taskId: string, newDuration: string) => void;
  /** Callback when the duration element is clicked */
  onDurationClick: (e: React.MouseEvent<HTMLElement>, taskId: string) => void;
  /** Callback when an input field loses focus */
  onInputBlur: () => void;
  /** Dialog openers for specific task types */
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

/**
 * A component that renders a single task row
 * 
 * This component is responsible for displaying a task in the task list,
 * handling selection state, and integrating with the TaskContent component
 * for rendering the actual task content.
 *
 * @param {TaskRowProps} props - The component props
 * @returns {JSX.Element} The rendered task row
 */
export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isSelected,
  editingTaskId,
  onTaskClick,
  onTaskDelete,
  onDurationChange,
  onDurationClick,
  onInputBlur,
  dialogOpeners,
}) => {
  const durationInMinutes = Math.round(Number(task.duration || 1500) / 60);
  const [inputValue, setInputValue] = useState(durationInMinutes.toString());
  const { getBorderColorClass, getBackgroundColorClass } = useTaskTypeColor();
  
  // Get task type specific styling
  const borderClass = getBorderColorClass(task.taskType || 'regular');
  const bgClass = getBackgroundColorClass(task.taskType || 'regular');

  // Update input value when task duration changes
  useEffect(() => {
    if (task.duration) {
      const minutes = Math.round(task.duration / 60);
      setInputValue(minutes.toString());
    }
  }, [task.duration, task.id]);

  // Prevent click events from bubbling up from interactive elements
  const preventPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  // Handle key down in input fields
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    e.stopPropagation();
  };

  // Handle changes to input values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (value === '' || /^\d+$/.test(value)) {
      setInputValue(value);
    }
  };

  // Handle input blur events
  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    let finalValue = inputValue;
    
    // Validate input value
    if (isNaN(numValue) || numValue < 1) {
      finalValue = '25'; // Default to 25 minutes if invalid
    } else if (numValue > 60) {
      finalValue = '60'; // Cap at 60 minutes
    }
    
    setInputValue(finalValue);
    
    // Convert minutes to seconds and update task
    const newDurationInSeconds = (parseInt(finalValue) * 60).toString();
    
    eventManager.emit('task:update', {
      taskId: task.id,
      updates: { duration: parseInt(newDurationInSeconds) }
    });
    onInputBlur();
  };

  // Handle task deletion
  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    eventManager.emit('task:delete', { taskId: task.id, reason: 'manual' });
  };

  // Handle task actions
  const handleTaskAction = (e: React.MouseEvent<HTMLElement>, actionType?: string) => {
    e.stopPropagation();
    if (actionType === 'complete') {
      eventManager.emit('task:complete', { taskId: task.id });
    } else if (actionType === 'uncomplete') {
      eventManager.emit('task:update', { 
        taskId: task.id, 
        updates: { completed: false, completedAt: null } 
      });
    } else if (actionType === 'delete') {
      handleDelete(e);
    }
  };

  // Handle clicks on the task row
  const handleTaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check for clicks on interactive elements to prevent task selection
    const target = e.target as HTMLElement;
    const isInteractive = 
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.tagName === 'INPUT' || 
      target.closest('input') ||
      target.getAttribute('role') === 'button' ||
      target.getAttribute('data-action') === 'true' ||
      target.closest('[data-action="true"]');
    
    if (isInteractive) {
      e.stopPropagation();
      return;
    }
    
    // Special handling for journal and checklist tasks
    if ((task.taskType === 'journal' || task.taskType === 'checklist') && !isSelected) {
      e.stopPropagation();
      
      // Select the task without triggering conversion
      eventManager.emit('task:select', task.id);
      return;
    }
    
    onTaskClick(task, e);
  };

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 group overflow-visible',
        'min-h-[4.5rem] flex flex-col justify-between w-full',
        isSelected 
          ? `bg-accent/20 border-primary/40 shadow-lg shadow-primary/5 ${borderClass}` 
          : `bg-card/40 border-border/[var(--border-medium)] hover:border-primary/30 hover:bg-accent/10 hover:shadow-md hover:scale-[1.01] ${bgClass} ${borderClass}/30`,
        'md:max-w-full'
      )}
      onClick={handleTaskClick}
      data-task-id={task.id}
      data-task-type={task.taskType}
    >
      <TaskContent
        task={task}
        isSelected={isSelected}
        onSelect={() => handleTaskClick as any}
        editingTaskId={editingTaskId}
        inputValue={inputValue}
        onDelete={handleDelete}
        onDurationClick={(e) => onDurationClick(e, task.id)}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        preventPropagation={preventPropagation}
        dialogOpeners={dialogOpeners}
        handleTaskAction={handleTaskAction}
      />
    </Card>
  );
};

export default TaskRow;
