
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskActions } from './TaskActions';
import { TaskContent } from '../TaskContent';
import { useTaskActionHandler } from './TaskActionHandler';

export interface TaskItemProps {
  task: Task;
  onOpenTaskDialog?: () => void;
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist?: ((taskId: string, taskName: string, items: any[]) => void) | undefined;
    journal?: ((taskId: string, taskName: string, entry: string) => void) | undefined;
    screenshot?: ((imageUrl: string, taskName: string) => void) | undefined;
    voicenote?: ((taskId: string, taskName: string) => void) | undefined;
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onOpenTaskDialog,
  isTimerView = false,
  dialogOpeners
}) => {
  const { selectTask, selected } = useTaskContext();
  const [isHovered, setIsHovered] = useState(false);
  const { handleTaskAction, handleDelete } = useTaskActionHandler(task, onOpenTaskDialog);
  
  const isSelected = selected === task.id;
  
  const handleSelectTask = useCallback(() => {
    selectTask(isSelected ? null : task.id);
  }, [selectTask, isSelected, task.id]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectTask();
    } else if (e.key === 'Delete') {
      e.preventDefault();
      handleDelete(e as any);
    }
  }, [handleSelectTask, handleDelete]);
  
  return (
    <div
      className={cn(
        "relative rounded-md border p-3 transition-all",
        isSelected ? "border-primary/50 bg-primary/5" : "border-border/50",
        isHovered && !isSelected && "border-border bg-card/80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelectTask}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Task: ${task.name}`}
    >
      <TaskContent
        task={task}
        isSelected={isSelected}
        dialogOpeners={dialogOpeners}
        onDelete={handleDelete}
        preventPropagation={(e) => e.stopPropagation()}
      />
      
      <TaskActions
        task={task}
        isHovered={isHovered}
        isSelected={isSelected}
        handleDelete={handleDelete}
        handleTaskAction={handleTaskAction}
      />
    </div>
  );
};
