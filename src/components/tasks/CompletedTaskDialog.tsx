
import React, { useEffect, useState } from 'react';
import { Task } from '@/types/tasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Clock, BarChart3, Hourglass, Trophy } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { QuoteDisplay } from '../quotes/QuoteDisplay';
import { TaskMetricsRow } from './TaskMetricsRow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { eventManager } from '@/lib/events/EventManager';
import { taskStorage } from '@/lib/storage/taskStorage';
import { taskOperations } from '@/lib/operations/taskOperations';
import { Note } from '@/types/notes';
import { EntityType } from '@/types/core';

interface CompletedTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompletedTaskDialog: React.FC<CompletedTaskDialogProps> = ({
  task,
  open,
  onOpenChange
}) => {
  const [linkedNotes, setLinkedNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (task && open) {
      // Load any linked notes
      try {
        // Check if the getLinkedNotes method exists on taskStorage
        if (typeof taskStorage.getLinkedNotes === 'function') {
          const notes = taskStorage.getLinkedNotes(task.id);
          setLinkedNotes(notes || []);
        } else {
          console.warn('taskStorage.getLinkedNotes is not available');
          setLinkedNotes([]);
        }
      } catch (error) {
        console.error('Error loading linked notes:', error);
        setLinkedNotes([]);
      }
    } else {
      setLinkedNotes([]);
    }
  }, [task, open]);

  if (!task) return null;

  const completionDate = task.completedAt ? new Date(task.completedAt) : null;
  const creationDate = new Date(task.createdAt);
  const metrics = task.metrics || {};
  const pauseCount = metrics.pauseCount || 0;
  const timeSpent = metrics.timeSpent ? Math.floor(metrics.timeSpent / 60) : 0;
  
  // Formatted completion date if available
  const formattedCompletionDate = completionDate 
    ? format(completionDate, 'PPP p')
    : 'Not completed';

  // Relative time
  const relativeCompletionTime = completionDate 
    ? formatDistanceToNow(completionDate, { addSuffix: true })
    : '';

  // Task duration in minutes (if available)
  const taskDuration = task.duration ? Math.floor(task.duration / 60) : null;

  // Efficiency ratio
  const efficiencyRatio = metrics.efficiencyRatio 
    ? `${Math.round(metrics.efficiencyRatio * 100)}%` 
    : null;

  // Task type display name
  const getTaskTypeDisplay = () => {
    switch (task.taskType) {
      case 'timer': return 'Timer Task';
      case 'habit': return 'Habit Task';
      case 'screenshot': return 'Screenshot Task';
      case 'journal': return 'Journal Entry';
      case 'checklist': return 'Checklist';
      default: return 'Regular Task';
    }
  };

  // Handle creating a new task from this completed one
  const handleCreateNewFromThis = () => {
    try {
      // Check if the createFromCompleted method exists on taskOperations
      if (typeof taskOperations.createFromCompleted === 'function') {
        taskOperations.createFromCompleted(task);
        onOpenChange(false);
      } else {
        console.warn('taskOperations.createFromCompleted is not available');
        // Fallback: Create a new task with basic properties
        taskOperations.createTask({
          name: task.name,
          description: task.description,
          completed: false,
          taskType: task.taskType,
          duration: task.duration
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error creating new task:', error);
    }
  };

  // Render metrics section based on task type
  const renderMetricsSection = () => {
    if (task.taskType === 'timer') {
      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <TaskMetricsRow 
            label="Time Spent"
            value={`${timeSpent} minutes`}
          />
          <TaskMetricsRow 
            label="Pause Count" 
            value={pauseCount.toString()}
          />
          <TaskMetricsRow 
            label="Efficiency"
            value={efficiencyRatio || 'N/A'}
          />
          <TaskMetricsRow 
            label="Completion"
            value={metrics.completionStatus || 'Complete'}
          />
        </div>
      );
    } else if (task.taskType === 'checklist' && task.checklistItems) {
      const completed = task.checklistItems.filter(item => item.completed).length;
      const total = task.checklistItems.length;
      
      return (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Checklist Items</h3>
          <p className="text-sm text-muted-foreground mb-2">
            {completed}/{total} items completed
          </p>
          <ul className="space-y-1">
            {task.checklistItems.map(item => (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                <div className={`h-4 w-4 mt-0.5 rounded-sm border ${item.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (task.taskType === 'journal' && task.journalEntry) {
      return (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Journal Entry</h3>
          <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
            {task.journalEntry}
          </div>
        </div>
      );
    } else if (task.taskType === 'screenshot' && task.imageUrl) {
      return (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Screenshot</h3>
          <div className="border rounded-md overflow-hidden">
            <img 
              src={task.imageUrl} 
              alt="Task screenshot" 
              className="w-full h-auto max-h-[300px] object-contain"
            />
          </div>
          {task.capturedText && (
            <div className="mt-2 text-sm text-muted-foreground">
              <p className="font-medium">Captured Text:</p>
              <p className="whitespace-pre-wrap">{task.capturedText}</p>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  // Handle viewing a related note
  const handleViewNote = (noteId: string) => {
    // Use type assertion to handle the event emission
    eventManager.emit('note:view' as any, { noteId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Completed Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task type badge */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-primary/10">
              {getTaskTypeDisplay()}
            </Badge>
            {task.relationships?.habitId && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Habit
              </Badge>
            )}
          </div>
          
          {/* Task name and description */}
          <div>
            <h2 className="text-xl font-semibold">{task.name}</h2>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Completion dates */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span>{formattedCompletionDate}</span>
            </div>
            {relativeCompletionTime && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relative:</span>
                <span>{relativeCompletionTime}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{formatDistanceToNow(creationDate, { addSuffix: true })}</span>
            </div>
            {taskDuration !== null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{taskDuration} minutes</span>
              </div>
            )}
          </div>
          
          {/* Task type specific metrics */}
          {renderMetricsSection()}
          
          {/* Favorite quotes section for timer tasks */}
          {task.taskType === 'timer' && metrics.favoriteQuotes && metrics.favoriteQuotes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                Favorite Quotes
              </h3>
              <div className="space-y-2">
                {metrics.favoriteQuotes.map((quote, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="pt-4">
                      <QuoteDisplay text={quote} author="" compact />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Related notes section */}
          {linkedNotes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Related Notes</h3>
              <div className="space-y-2">
                {linkedNotes.map((note) => (
                  <Card 
                    key={note.id} 
                    className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleViewNote(note.id)}
                  >
                    <CardContent className="p-3">
                      <h4 className="text-sm font-medium truncate">
                        {note.content.split('\n')[0].replace(/^#+ /, '')}
                      </h4>
                      {note.content && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {note.content.split('\n').slice(1).join('\n')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleCreateNewFromThis}>
              Create New from This
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
