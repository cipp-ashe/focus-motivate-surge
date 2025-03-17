
import React from 'react';
import { Task } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskDetailsProps {
  task: Task;
  isSelected: boolean;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  isSelected,
  dialogOpeners
}) => {
  // Format the task creation date
  const createdAtDate = new Date(task.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  
  // Handle specialized content
  const handleSpecializedContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!dialogOpeners) return;
    
    if (task.taskType === 'checklist' && dialogOpeners.checklist) {
      dialogOpeners.checklist(task.id, task.name, task.checklistItems || []);
    } else if (task.taskType === 'journal' && dialogOpeners.journal) {
      dialogOpeners.journal(task.id, task.name, task.journalEntry || '');
    } else if (task.taskType === 'screenshot' && task.imageUrl && dialogOpeners.screenshot) {
      dialogOpeners.screenshot(task.imageUrl, task.name);
    } else if (task.taskType === 'voicenote' && dialogOpeners.voicenote) {
      dialogOpeners.voicenote(task.id, task.name);
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
    <div className="flex flex-col">
      {/* Task description */}
      {task.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {task.description}
        </p>
      )}
      
      {/* Special content indicator */}
      {hasSpecialContent && (
        <button
          onClick={handleSpecializedContent}
          className="text-xs text-primary hover:underline mt-1 text-left"
          aria-label={`View ${task.taskType} content`}
        >
          View {task.taskType} content
        </button>
      )}
      
      {/* Task metadata */}
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        {/* Created date */}
        <span>{timeAgo}</span>
        
        {/* Habit relationship */}
        {task.relationships?.habitId && (
          <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">
            Habit
          </span>
        )}
        
        {/* Task duration */}
        {task.duration && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
            {Math.floor(task.duration / 60)} min
          </span>
        )}
        
        {/* Task status */}
        {task.status && task.status !== 'pending' && (
          <span className={cn(
            "px-1.5 py-0.5 rounded-sm",
            task.status === 'completed' && "bg-green-500/20 text-green-600",
            task.status === 'in-progress' && "bg-yellow-500/20 text-yellow-600",
            task.status === 'dismissed' && "bg-gray-500/20 text-gray-600",
            task.status === 'delayed' && "bg-red-500/20 text-red-600",
          )}>
            {task.status.replace('-', ' ')}
          </span>
        )}
      </div>
    </div>
  );
};
