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

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task, isSelected, dialogOpeners }) => {
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
  const hasSpecialContent =
    (task.taskType === 'checklist' && task.checklistItems?.length) ||
    (task.taskType === 'journal' && task.journalEntry) ||
    (task.taskType === 'screenshot' && task.imageUrl) ||
    (task.taskType === 'voicenote' && task.voiceNoteUrl);

  // Don't show anything if there's nothing to display
  if (!isSelected && !task.status) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {/* Task metadata */}
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground whitespace-nowrap">
        {/* Additional metadata can be added here if needed */}
        {isSelected && task.updatedAt && task.updatedAt !== task.createdAt && (
          <span
            title={`Last updated ${formatDistanceToNow(new Date(task.updatedAt), {
              addSuffix: true,
            })}`}
          >
            (updated)
          </span>
        )}
      </div>

      {/* Show additional details only when selected */}
      {isSelected && task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {task.tags.map((tag) => (
            <span key={tag} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
