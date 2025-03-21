
import React from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { TaskIcon } from './TaskIcon';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface TaskContentDisplayProps {
  task: Task;
  handleTaskAction?: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContentDisplay = React.memo(({ task, handleTaskAction }: TaskContentDisplayProps) => {
  // Extract task data for easier access
  const { name, description, completed, taskType, createdAt, duration, relationships, status } = task;
  
  // Format the task creation date
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';
  
  // Handle specialized content click
  const handleSpecializedContent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!handleTaskAction) return;
    
    if (task.taskType === 'checklist') {
      handleTaskAction(e, 'checklist');
    } else if (task.taskType === 'journal') {
      handleTaskAction(e, 'journal');
    } else if (task.taskType === 'screenshot' && task.imageUrl) {
      handleTaskAction(e, 'screenshot');
    } else if (task.taskType === 'voicenote') {
      handleTaskAction(e, 'voicenote');
    }
  };
  
  // Special content indicator
  const hasSpecialContent = (
    (task.taskType === 'checklist' && task.checklistItems?.length) ||
    (task.taskType === 'journal' && task.journalEntry) ||
    (task.taskType === 'screenshot' && task.imageUrl) ||
    (task.taskType === 'voicenote' && task.voiceNoteUrl)
  );
  
  return (
    <div className="flex-1 min-w-0" data-testid="task-content-display">
      <div className="flex items-center gap-1.5">
        <TaskIcon taskType={taskType || 'regular'} size={16} />
        
        <h3 
          className={cn(
            "font-medium break-words line-clamp-2",
            completed && "line-through text-muted-foreground"
          )}
          aria-label={`Task: ${name}`}
        >
          {name}
        </h3>
      </div>
      
      {description && (
        <p 
          className="text-xs text-muted-foreground mt-1 line-clamp-2"
          title={description}
        >
          {description}
        </p>
      )}
      
      <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
        {/* Status badge */}
        {status && status !== 'pending' && (
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs py-0",
              status === 'completed' && "bg-green-500/10 text-green-600 border-green-200",
              status === 'in-progress' && "bg-amber-500/10 text-amber-600 border-amber-200",
              status === 'started' && "bg-blue-500/10 text-blue-600 border-blue-200",
              status === 'delayed' && "bg-orange-500/10 text-orange-600 border-orange-200",
              status === 'dismissed' && "bg-red-500/10 text-red-600 border-red-200"
            )}
          >
            {status.replace('-', ' ')}
          </Badge>
        )}
        
        {/* Created date */}
        {timeAgo && (
          <span className="text-muted-foreground">{timeAgo}</span>
        )}
        
        {/* Task duration */}
        {duration && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
            {Math.floor(duration / 60)} min
          </span>
        )}
        
        {/* Habit indicator */}
        {relationships?.habitId && (
          <Badge 
            variant="outline" 
            className="text-xs py-0 bg-green-500/10 text-green-600 border-green-200"
          >
            habit
          </Badge>
        )}
      </div>
      
      {/* Special content link */}
      {hasSpecialContent && (
        <button
          onClick={handleSpecializedContent}
          className="text-xs text-primary hover:underline mt-1.5 text-left"
          aria-label={`View ${task.taskType} content`}
        >
          View {task.taskType} content
        </button>
      )}
    </div>
  );
});

TaskContentDisplay.displayName = 'TaskContentDisplay';
