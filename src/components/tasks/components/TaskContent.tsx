
import React from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { TaskTypeIcon } from './TaskTypeIcon';
import { TaskDetails } from './TaskDetails';

interface TaskContentProps {
  task: Task;
  isSelected: boolean;
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
  handleTaskAction: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContent: React.FC<TaskContentProps> = ({
  task,
  isSelected,
  isTimerView = false,
  dialogOpeners,
  handleTaskAction
}) => {
  return (
    <div className="flex items-start gap-2">
      {/* Skip checkbox for timer tasks in timer view */}
      {!(isTimerView && task.taskType === 'timer') && (
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => {
            handleTaskAction({} as any, checked ? 'true' : 'false');
          }}
          aria-label={`Mark task "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <TaskTypeIcon taskType={task.taskType} />
          
          <h3 
            className={cn(
              "font-medium break-words line-clamp-2",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.name}
          </h3>
        </div>
        
        <TaskDetails
          task={task}
          isSelected={isSelected}
          dialogOpeners={dialogOpeners}
        />
      </div>
    </div>
  );
};
