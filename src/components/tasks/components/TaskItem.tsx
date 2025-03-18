
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskActions } from './TaskActions';
import { TaskContent } from './TaskContent';
import { useTaskActionHandler } from './TaskActionHandler';

export interface TaskItemProps {
  task: Task;
  onOpenTaskDialog?: () => void;
  isTimerView?: boolean;
  isSelected?: boolean;
  dialogOpeners?: {
    checklist?: ((taskId: string, taskName: string, items: any[]) => void);
    journal?: ((taskId: string, taskName: string, entry: string) => void);
    screenshot?: ((imageUrl: string, taskName: string) => void);
    voicenote?: ((taskId: string, taskName: string) => void);
  };
  onSelect?: () => void;
  onDelete?: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onOpenTaskDialog,
  isTimerView = false,
  isSelected = false,
  dialogOpeners,
  onSelect,
  onDelete
}) => {
  const { selectTask, selected } = useTaskContext();
  const [isHovered, setIsHovered] = useState(false);
  const { handleTaskAction } = useTaskActionHandler(task, onOpenTaskDialog);
  
  const taskIsSelected = isSelected || selected === task.id;
  
  const handleSelectTask = useCallback(() => {
    if (onSelect) {
      onSelect();
    } else {
      selectTask(taskIsSelected ? null : task.id);
    }
  }, [selectTask, taskIsSelected, task.id, onSelect]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectTask();
    } else if (e.key === 'Delete') {
      e.preventDefault();
      if (onDelete) {
        onDelete();
      }
    }
  }, [handleSelectTask, onDelete]);
  
  const handleDeleteClick = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);
  
  return (
    <div
      className={cn(
        "relative rounded-md border p-3 transition-all",
        taskIsSelected ? "border-primary/50 bg-primary/5" : "border-border/50",
        isHovered && !taskIsSelected && "border-border bg-card/80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelectTask}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={taskIsSelected}
      aria-label={`Task: ${task.name}`}
    >
      <TaskContent
        task={task}
        isSelected={taskIsSelected}
        isTimerView={isTimerView}
        dialogOpeners={dialogOpeners}
        handleTaskAction={handleTaskAction}
      />
      
      <TaskActions
        task={task}
        isHovered={isHovered}
        isSelected={taskIsSelected}
        handleDelete={handleDeleteClick}
        handleTaskAction={handleTaskAction}
      />
    </div>
  );
};
