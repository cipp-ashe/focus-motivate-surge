
import React from 'react';
import { Task } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Check, X, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface TaskActionButtonProps {
  task: Task;
  onTaskAction?: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => void;
  editingTaskId?: string | null;
  inputValue?: string;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskActionButton: React.FC<TaskActionButtonProps> = ({ 
  task, 
  onTaskAction,
  editingTaskId,
  inputValue,
  dialogOpeners
}) => {
  // Determine if this task is currently being edited
  const isEditing = editingTaskId === task.id;

  // Check if there is task specific data
  const hasJournalEntry = task.journalEntry && task.journalEntry.trim().length > 0;
  const hasChecklist = task.checklistItems && task.checklistItems.length > 0;
  const hasImage = task.imageUrl && task.imageUrl.trim().length > 0;
  const hasAudio = task.audioUrl && task.audioUrl.trim().length > 0;

  // Handle dropdown actions
  const handleAction = (e: React.MouseEvent<HTMLDivElement>, actionType: string) => {
    e.stopPropagation();
    if (onTaskAction) {
      onTaskAction(e, actionType);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => onTaskAction?.(e, 'cancel')}
          className="h-7 w-7 p-0"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="default"
          onClick={(e) => onTaskAction?.(e, 'save')}
          className="h-7 w-7 p-0"
          disabled={!inputValue || inputValue.trim() === ''}
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {/* Edit action */}
        <DropdownMenuItem
          onClick={(e) => handleAction(e, 'edit')}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>

        {/* Special actions based on task type */}
        {task.taskType === 'journal' && (
          <DropdownMenuItem
            onClick={(e) => handleAction(e, 'journal')}
            className="flex items-center gap-2"
          >
            <span>Open Journal</span>
            {hasJournalEntry && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
            )}
          </DropdownMenuItem>
        )}

        {task.taskType === 'checklist' && (
          <DropdownMenuItem
            onClick={(e) => handleAction(e, 'checklist')}
            className="flex items-center gap-2"
          >
            <span>Open Checklist</span>
            {hasChecklist && (
              <span className="ml-auto h-2 w-2 rounded-full bg-primary"></span>
            )}
          </DropdownMenuItem>
        )}

        {task.taskType === 'timer' && (
          <DropdownMenuItem
            onClick={(e) => handleAction(e, 'timer')}
            className="flex items-center gap-2"
          >
            <span>Start Timer</span>
          </DropdownMenuItem>
        )}

        {task.taskType === 'screenshot' && hasImage && (
          <DropdownMenuItem
            onClick={(e) => handleAction(e, 'screenshot')}
            className="flex items-center gap-2"
          >
            <span>View Screenshot</span>
          </DropdownMenuItem>
        )}

        {task.taskType === 'voicenote' && hasAudio && (
          <DropdownMenuItem
            onClick={(e) => handleAction(e, 'voicenote')}
            className="flex items-center gap-2"
          >
            <span>Play Voice Note</span>
          </DropdownMenuItem>
        )}

        {/* Complete action */}
        <DropdownMenuItem
          onClick={(e) => handleAction(e, 'complete')}
          className="flex items-center gap-2 text-green-600"
        >
          <Check className="h-4 w-4" />
          <span>Complete</span>
        </DropdownMenuItem>

        {/* Dismiss action */}
        <DropdownMenuItem
          onClick={(e) => handleAction(e, 'dismiss')}
          className="flex items-center gap-2 text-amber-600"
        >
          <X className="h-4 w-4" />
          <span>Dismiss</span>
        </DropdownMenuItem>

        {/* Delete action */}
        <DropdownMenuItem
          onClick={(e) => handleAction(e, 'delete')}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
