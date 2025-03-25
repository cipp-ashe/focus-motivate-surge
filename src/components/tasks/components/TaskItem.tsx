
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskActions } from './TaskActions';
import { TaskContent } from './TaskContent';
import { useTaskActionHandler } from './TaskActionHandler';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';

export interface TaskItemProps {
  task: Task;
  onOpenTaskDialog?: () => void;
  isTimerView?: boolean;
  isSelected?: boolean;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  onSelect?: () => void;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<Task>) => void;
  onComplete?: (metrics?: any) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onOpenTaskDialog,
  isTimerView = false,
  isSelected = false,
  dialogOpeners,
  onSelect,
  onDelete,
  onUpdate,
  onComplete,
}) => {
  const { selectTask, selected } = useTaskContext();
  const [isHovered, setIsHovered] = useState(false);
  const { handleTaskAction } = useTaskActionHandler(task, onOpenTaskDialog);
  const { getBorderColorClass, getBackgroundColorClass } = useTaskTypeColor();

  const taskIsSelected = isSelected || selected === task.id;
  const taskType = task.taskType || 'standard';
  
  // Get border color based on task type
  const borderColorClass = getBorderColorClass(taskType);
  const bgColorClass = getBackgroundColorClass(taskType);

  const handleSelectTask = useCallback(() => {
    if (onSelect) {
      onSelect();
    } else {
      selectTask(taskIsSelected ? null : task.id);
    }
  }, [selectTask, taskIsSelected, task.id, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelectTask();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (onDelete) {
          onDelete();
        }
      }
    },
    [handleSelectTask, onDelete]
  );

  const handleDeleteClick = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  return (
    <div
      className={cn(
        'relative rounded-lg border p-3 transition-all w-full',
        'min-h-[4.5rem] flex flex-col justify-between gap-2',
        taskIsSelected
          ? `border-primary/50 dark:border-primary/40 shadow-md ${borderColorClass}/60 bg-primary/5 dark:bg-primary/10`
          : `border-border/40 dark:border-border/30 hover:border-border/70 dark:hover:border-border/60 ${borderColorClass}/30 ${bgColorClass}`,
        isHovered &&
          !taskIsSelected &&
          'border-border/70 dark:border-border/60 bg-card/50 dark:bg-card/40 shadow-sm',
        'md:max-w-full'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelectTask}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      data-selected={taskIsSelected}
      data-task-type={taskType}
      aria-label={`Task: ${task.name}`}
    >
      <TaskContent
        task={task}
        isSelected={taskIsSelected}
        isTimerView={isTimerView}
        dialogOpeners={dialogOpeners}
        handleTaskAction={(e: React.MouseEvent<Element>, actionType?: string) =>
          handleTaskAction(e, actionType)
        }
      />

      {/* Always show TaskActions */}
      <TaskActions
        task={task}
        isHovered={isHovered || taskIsSelected}
        isSelected={taskIsSelected}
        handleDelete={handleDeleteClick}
        handleTaskAction={(e, actionType) =>
          handleTaskAction(e as React.MouseEvent<Element>, actionType)
        }
      />
    </div>
  );
};
