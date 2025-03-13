import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task, TaskMetrics } from '@/types/tasks';
import { formatDate } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, BarChart2, Pause, FastForward, Zap, Award } from 'lucide-react';
import { formatDuration } from '@/lib/utils/formatters';

interface CompletedTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CompletedTaskDialog: React.FC<CompletedTaskDialogProps> = ({
  task,
  open,
  onOpenChange,
}) => {
  if (!task) return null;

  const taskMetrics = task.metrics as TaskMetrics;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {task.name}
          </DialogTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {task.taskType || 'Task'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Completed {formatDate(task.completedAt || '')}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {taskMetrics && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(taskMetrics.actualDuration || taskMetrics.timeSpent || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Completed</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(taskMetrics.completionDate || task.completedAt || '')}
                    </p>
                  </div>
                </div>

                {taskMetrics.pauseCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Pause className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pauses</p>
                      <p className="text-sm text-muted-foreground">
                        {taskMetrics.pauseCount} times
                      </p>
                    </div>
                  </div>
                )}

                {taskMetrics.extensionTime !== undefined && taskMetrics.extensionTime > 0 && (
                  <div className="flex items-center gap-2">
                    <FastForward className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Extended</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDuration(taskMetrics.extensionTime)}
                      </p>
                    </div>
                  </div>
                )}

                {taskMetrics.efficiencyRatio !== undefined && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Efficiency</p>
                      <p className="text-sm text-muted-foreground">
                        {(taskMetrics.efficiencyRatio * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                )}

                {taskMetrics.completionStatus && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground">
                        {taskMetrics.completionStatus}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {taskMetrics.favoriteQuotes && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Favorite Quotes:</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    {taskMetrics.favoriteQuotes.map((quote, index) => (
                      <li key={index}>{typeof quote === 'string' ? quote : 'Quote'}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {task.notes && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Notes:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.notes}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
