
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task, TaskMetrics } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { ClockIcon, BookOpen, Image, CheckSquare, Calendar, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { TaskMetricsRow } from './TaskMetricsRow';
import { ScrollArea } from '../ui/scroll-area';
import { relationshipManager } from '@/lib/relationshipManager';

interface CompletedTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompletedTaskDialog({ 
  task, 
  open, 
  onOpenChange 
}: CompletedTaskDialogProps) {
  if (!task) return null;

  const metrics = task.metrics || {};
  const completedDate = task.completedAt ? new Date(task.completedAt) : null;
  const relatedNotes = relationshipManager.getRelatedEntities(task.id, 'task', 'note');
  
  // Helper function to get task type icon
  const getTaskTypeIcon = () => {
    switch (task.taskType) {
      case 'timer':
        return <ClockIcon className="h-4 w-4 text-purple-400" />;
      case 'screenshot':
        return <Image className="h-4 w-4 text-blue-400" />;
      case 'habit':
        return <Calendar className="h-4 w-4 text-green-400" />;
      case 'journal':
        return <BookOpen className="h-4 w-4 text-amber-400" />;
      case 'checklist':
        return <CheckSquare className="h-4 w-4 text-cyan-400" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getTaskTypeIcon()}
            <DialogTitle className="text-lg">{task.name}</DialogTitle>
          </div>
          <DialogDescription className="flex justify-between items-center">
            <span>
              {completedDate ? (
                <>Completed {formatDistanceToNow(completedDate, { addSuffix: true })}</>
              ) : (
                <>Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</>
              )}
            </span>
            {task.taskType && (
              <Badge variant="outline" className={cn(
                "ml-2",
                task.taskType === 'timer' && "bg-purple-100 text-purple-800",
                task.taskType === 'screenshot' && "bg-blue-100 text-blue-800",
                task.taskType === 'habit' && "bg-green-100 text-green-800",
                task.taskType === 'journal' && "bg-amber-100 text-amber-800",
                task.taskType === 'checklist' && "bg-cyan-100 text-cyan-800",
                !task.taskType && "bg-gray-100 text-gray-800"
              )}>
                {task.taskType || 'regular'}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}
            
            {/* Display metrics based on task type */}
            {task.taskType === 'timer' && (
              <div className="bg-slate-50 p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" /> Timer Metrics
                </h4>
                <div className="space-y-1 text-sm">
                  <TaskMetricsRow 
                    label="Expected Time" 
                    value={metrics.expectedTime ? `${Math.floor(metrics.expectedTime / 60)}m` : 'N/A'} 
                  />
                  <TaskMetricsRow 
                    label="Actual Time" 
                    value={metrics.actualTime ? `${Math.floor(metrics.actualTime / 60)}m` : 'N/A'} 
                  />
                  <TaskMetricsRow 
                    label="Pauses" 
                    value={metrics.pauseCount?.toString() || '0'} 
                  />
                  <TaskMetricsRow 
                    label="Efficiency" 
                    value={metrics.efficiencyRatio ? `${(metrics.efficiencyRatio * 100).toFixed(0)}%` : 'N/A'} 
                  />
                </div>
              </div>
            )}
            
            {/* Display journal content if available */}
            {task.taskType === 'journal' && task.journalEntry && (
              <div className="bg-amber-50 p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Journal Entry
                </h4>
                <p className="text-sm whitespace-pre-line">{task.journalEntry}</p>
              </div>
            )}
            
            {/* Display checklist items if available */}
            {task.taskType === 'checklist' && task.checklistItems && task.checklistItems.length > 0 && (
              <div className="bg-cyan-50 p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" /> Checklist Items
                </h4>
                <ul className="space-y-1">
                  {task.checklistItems.map(item => (
                    <li key={item.id} className="flex items-center gap-2 text-sm">
                      <div className={cn(
                        "h-3 w-3 rounded-sm border",
                        item.completed ? "bg-primary border-primary" : "border-gray-300"
                      )} />
                      <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Display screenshot/image if available */}
            {task.taskType === 'screenshot' && task.imageUrl && (
              <div className="bg-blue-50 p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Image className="h-3 w-3" /> Screenshot
                </h4>
                <div className="border rounded-md overflow-hidden">
                  <img 
                    src={task.imageUrl} 
                    alt={task.name} 
                    className="w-full object-contain max-h-60"
                  />
                </div>
                {task.capturedText && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium mb-1">Captured Text</h5>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">
                      {task.capturedText}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Display related notes if any */}
            {relatedNotes.length > 0 && (
              <div className="bg-slate-50 p-3 rounded-md shadow-sm">
                <h4 className="text-sm font-medium mb-2">Related Notes</h4>
                <ul className="space-y-1">
                  {relatedNotes.map(note => (
                    <li key={note.id} className="text-sm">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // Navigate to the note
                          window.location.href = `/notes/${note.id}`;
                        }}
                      >
                        {note.content?.substring(0, 30) || 'Untitled Note'}...
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
