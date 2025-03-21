
import React, { useState, useCallback } from 'react';
import { Task, TaskStatus } from '@/types/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Timer, Pencil, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaskIcon } from './components/TaskIcon';
import { TaskActionButton } from './components/TaskActionButton';

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => void;
  onUpdate: (updates: Partial<Task>) => void;
  onComplete: (metrics?: any) => void;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isSelected,
  onSelect,
  onDelete,
  onUpdate,
  onComplete,
  dialogOpeners
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the task creation date
  const createdAtDate = task.createdAt ? new Date(task.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  
  // Handle task completion
  const handleComplete = useCallback((e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onComplete({ completedAt: new Date().toISOString() });
  }, [onComplete]);
  
  // Handle task action
  const handleTaskAction = useCallback((e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => {
    e.stopPropagation();
    
    if (!actionType) return;
    
    if (actionType === 'complete') {
      handleComplete(e);
    } else if (actionType === 'delete') {
      onDelete(e);
    } else if (actionType === 'edit') {
      console.log('Edit task:', task.id);
      // Add edit logic here if needed
    } else if (actionType === 'dismiss') {
      onUpdate({ status: 'dismissed', dismissedAt: new Date().toISOString() });
    } else if (actionType.startsWith('status-')) {
      // Handle status changes
      const status = actionType.replace('status-', '') as TaskStatus;
      onUpdate({ status });
    } else if (actionType === 'timer' && task.taskType === 'timer') {
      console.log('Starting timer for task:', task.id);
      // Add timer logic here
    } else if (dialogOpeners) {
      // Handle specialized content dialogs
      if (actionType === 'checklist' && dialogOpeners.checklist) {
        dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
      } else if (actionType === 'journal' && dialogOpeners.journal) {
        dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
      } else if (actionType === 'screenshot' && task.imageUrl && dialogOpeners.screenshot) {
        dialogOpeners.screenshot(task.imageUrl, task.name);
      } else if (actionType === 'voicenote' && dialogOpeners.voicenote) {
        dialogOpeners.voicenote(task.id, task.name);
      }
    }
  }, [task, handleComplete, onDelete, onUpdate, dialogOpeners]);
  
  // Determine status display for the task
  const getStatusBadge = () => {
    if (!task.status || task.status === 'pending') return null;
    
    const statusClasses = {
      'started': 'bg-blue-500/10 text-blue-600 border-blue-200',
      'in-progress': 'bg-amber-500/10 text-amber-600 border-amber-200',
      'delayed': 'bg-orange-500/10 text-orange-600 border-orange-200',
      'completed': 'bg-green-500/10 text-green-600 border-green-200',
      'dismissed': 'bg-red-500/10 text-red-600 border-red-200'
    };
    
    return (
      <Badge variant="outline" className={cn(
        "text-xs py-0 h-5",
        statusClasses[task.status as keyof typeof statusClasses]
      )}>
        {task.status.replace('-', ' ')}
      </Badge>
    );
  };
  
  // Special content indicator
  const hasSpecialContent = (
    (task.taskType === 'checklist' && task.checklistItems?.length) ||
    (task.taskType === 'journal' && task.journalEntry) ||
    (task.taskType === 'screenshot' && task.imageUrl) ||
    (task.taskType === 'voicenote' && task.voiceNoteUrl)
  );
  
  // Determine if the task has timer duration
  const hasDuration = task.duration && task.duration > 0;
  
  return (
    <Card
      className={cn(
        "relative border p-3 transition-all task-item-hover",
        isSelected ? "border-primary/50 bg-primary/5" : "border-border/50",
        isHovered && !isSelected && "border-border bg-card/80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Task: ${task.name}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleComplete}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "transition-colors",
              task.completed && "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            )}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <TaskIcon taskType={task.taskType || 'regular'} size={16} />
            
            <h3 className={cn(
              "font-medium text-sm break-words line-clamp-2",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.name}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
            {/* Created date */}
            <span>{timeAgo}</span>
            
            {/* Task duration if available */}
            {hasDuration && (
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                {Math.floor(task.duration / 60)} min
              </span>
            )}
            
            {/* Task status badge */}
            {getStatusBadge()}
            
            {/* Habit relationship */}
            {task.relationships?.habitId && (
              <Badge variant="outline" className="text-xs py-0 h-5 bg-green-500/10 text-green-600 border-green-200">
                Habit
              </Badge>
            )}
            
            {/* Special content indicator */}
            {hasSpecialContent && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  if (task.taskType === 'checklist') {
                    handleTaskAction(e as any, 'checklist');
                  } else if (task.taskType === 'journal') {
                    handleTaskAction(e as any, 'journal');
                  } else if (task.taskType === 'screenshot') {
                    handleTaskAction(e as any, 'screenshot');
                  } else if (task.taskType === 'voicenote') {
                    handleTaskAction(e as any, 'voicenote');
                  }
                }}
              >
                View {task.taskType} content
              </Button>
            )}
          </div>
        </div>
        
        {/* Action button and quick access buttons */}
        <div className="flex items-center gap-1">
          {/* Show timer button for timer tasks */}
          {task.taskType === 'timer' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={(e) => handleTaskAction(e, 'timer')}
              aria-label="Start timer"
            >
              <Timer className="h-4 w-4" />
            </Button>
          )}
          
          {/* Show delete button when hovered or selected */}
          {(isHovered || isSelected) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => onDelete(e)}
              aria-label="Delete task"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Actions dropdown */}
          <TaskActionButton 
            task={task}
            onTaskAction={handleTaskAction}
            dialogOpeners={dialogOpeners}
          />
        </div>
      </div>
      
      {/* Additional actions when selected */}
      {isSelected && (
        <div className="mt-2 pt-2 border-t flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={(e) => handleTaskAction(e, 'edit')}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs text-green-600"
            onClick={(e) => handleTaskAction(e, 'complete')}
          >
            <Check className="h-3 w-3 mr-1" />
            Complete
          </Button>
        </div>
      )}
    </Card>
  );
};
