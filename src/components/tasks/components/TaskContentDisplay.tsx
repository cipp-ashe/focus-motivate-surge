
import React from 'react';
import { Task } from '@/types/tasks';
import { cn } from '@/lib/utils';
import { TaskIcon } from './TaskIcon';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Clock, Image, FileText, Mic, ClipboardList } from 'lucide-react';

interface TaskContentDisplayProps {
  task: Task;
  handleTaskAction?: (e: React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const TaskContentDisplay = React.memo(
  ({ task, handleTaskAction }: TaskContentDisplayProps) => {
    // Extract task data for easier access
    const { name, description, completed, taskType, createdAt, duration, relationships } = task;

    // Format the task creation date
    const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

    // Handle specialized content click
    const handleSpecializedContent = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
      e.stopPropagation();
      if (!handleTaskAction) return;
      handleTaskAction(e, type);
    };

    // Determine if task has special content
    const hasChecklistContent = task.taskType === 'checklist' && task.checklistItems?.length;
    const hasJournalContent = task.taskType === 'journal' && task.journalEntry;
    const hasScreenshotContent = task.taskType === 'screenshot' && task.imageUrl;
    const hasVoiceNoteContent = task.taskType === 'voicenote' && task.voiceNoteUrl;
    const hasTimerContent = task.taskType === 'timer';

    return (
      <div className="flex-1 min-w-0" data-testid="task-content-display">
        <div className="flex flex-col mb-1">
          <div className="flex items-center gap-1.5">
            <TaskIcon taskType={taskType || 'regular'} size={16} />

            <h3
              className={cn(
                'font-medium break-words line-clamp-2',
                completed && 'line-through text-muted-foreground'
              )}
              aria-label={`Task: ${name}`}
            >
              {name}
            </h3>
          </div>

          {/* Timestamp - small and subtle under the title */}
          <span className="text-[10px] text-muted-foreground/70 ml-6 -mt-0.5">{timeAgo}</span>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={description}>
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
          {/* Task duration */}
          {duration && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
              {Math.floor(duration / 60)} min
            </span>
          )}

          {/* Habit indicator */}
          {relationships?.habitId && (
            <Badge variant="outline" className="border-theme-medium">
              habit
            </Badge>
          )}
        </div>

        {/* Special content action buttons */}
        <div className="flex flex-wrap gap-1 mt-2">
          {hasChecklistContent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
              onClick={(e) => handleSpecializedContent(e, 'checklist')}
            >
              <ClipboardList className="h-3.5 w-3.5 mr-1" />
              Checklist
            </Button>
          )}
          
          {hasJournalContent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-amber-500 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
              onClick={(e) => handleSpecializedContent(e, 'journal')}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Journal
            </Button>
          )}
          
          {hasScreenshotContent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-cyan-500 dark:text-cyan-400 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-300"
              onClick={(e) => handleSpecializedContent(e, 'screenshot')}
            >
              <Image className="h-3.5 w-3.5 mr-1" />
              Image
            </Button>
          )}
          
          {hasVoiceNoteContent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
              onClick={(e) => handleSpecializedContent(e, 'voicenote')}
            >
              <Mic className="h-3.5 w-3.5 mr-1" />
              Voice
            </Button>
          )}
          
          {hasTimerContent && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-purple-500 dark:text-purple-400 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
              onClick={(e) => handleSpecializedContent(e, 'timer')}
            >
              <Clock className="h-3.5 w-3.5 mr-1" />
              Timer
            </Button>
          )}
        </div>
      </div>
    );
  }
);

TaskContentDisplay.displayName = 'TaskContentDisplay';
