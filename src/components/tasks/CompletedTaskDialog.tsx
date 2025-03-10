
import React from 'react';
import { Task } from '@/types/tasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, BookOpen, Image, Timer, Pencil, FileText } from 'lucide-react';
import { relationshipManager } from '@/lib/relationshipManager';
import { useNoteState } from '@/contexts/notes/NoteContext';
import { formatTime } from '@/utils/timeUtils';

interface CompletedTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompletedTaskDialog: React.FC<CompletedTaskDialogProps> = ({
  task,
  open,
  onOpenChange,
}) => {
  const noteState = useNoteState();

  if (!task) return null;

  // Find associated journal entry if exists
  const relatedEntities = relationshipManager.getRelatedEntities(task.id, 'task', 'note');
  const associatedNotes = relatedEntities.length > 0 
    ? relatedEntities.map(rel => noteState.items.find(note => note.id === rel.id)).filter(Boolean)
    : [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get appropriate icon based on task type
  const getTaskTypeIcon = () => {
    switch(task.taskType) {
      case 'timer':
        return <Timer className="h-4 w-4 text-purple-400" />;
      case 'screenshot':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'habit':
        return <Calendar className="h-4 w-4 text-green-400" />;
      case 'regular':
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getTaskTypeIcon()}
            <DialogTitle className="text-xl font-bold">{task.name}</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Completed on {formatDate(task.completedAt)}</span>
            </div>
            {task.taskType && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                  {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)} Task
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {task.description && (
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Description</h3>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
        )}

        {task.metrics && task.taskType === 'timer' && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Timer Metrics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {task.metrics.expectedTime && (
                <div>
                  <p className="text-xs text-muted-foreground">Expected Time</p>
                  <p>{task.metrics.expectedTime} min</p>
                </div>
              )}
              {task.metrics.actualDuration !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Actual Time</p>
                  <p>{task.metrics.actualDuration} min</p>
                </div>
              )}
              {task.metrics.pauseCount !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Breaks Taken</p>
                  <p>{task.metrics.pauseCount}</p>
                </div>
              )}
              {task.metrics.efficiencyRatio !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p>{task.metrics.efficiencyRatio.toFixed(1)}%</p>
                </div>
              )}
              {task.metrics.completionStatus && (
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p>{task.metrics.completionStatus}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {associatedNotes.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Associated Journal Entries</h3>
            <div className="space-y-2">
              {associatedNotes.map(note => (
                <div key={note!.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                  <BookOpen className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{note?.title || 'Untitled Note'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {note!.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {task.imageUrl && (
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Attached Image</h3>
            <div className="overflow-hidden rounded-md border">
              <img 
                src={task.imageUrl} 
                alt={task.name} 
                className="w-full object-cover h-40" 
              />
            </div>
            {task.capturedText && (
              <div className="text-xs text-muted-foreground mt-1">
                <p className="font-medium">Captured Text:</p>
                <p className="mt-1">{task.capturedText}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
