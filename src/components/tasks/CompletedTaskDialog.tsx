
import React from 'react';
import { Clock, BarChart3, Pause, Maximize, CalendarClock } from 'lucide-react';
import { formatDuration, formatPercentage, formatTimestamp } from '@/lib/utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDuration as formatDurationUtil } from '@/lib/utils/formatters';
import { Task } from '@/types/tasks';
import { TimerStateMetrics } from '@/types/metrics';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

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
  
  const isTimerTask = task.taskType === 'timer';
  const metrics = task.metrics;
  
  // Format metrics for display
  const expectedTime = metrics?.expectedTime ? formatDuration(metrics.expectedTime) : 'N/A';
  const actualTime = metrics?.actualDuration ? formatDuration(metrics.actualDuration) : 
                    (metrics?.timeSpent ? formatDuration(metrics.timeSpent) : 'N/A');
  const pauseCount = metrics?.pauseCount ?? 0;
  const efficiency = metrics?.efficiencyRatio ? 
    formatPercentage(metrics.efficiencyRatio) : '0%';
  const completedAt = task.completedAt ? formatTimestamp(task.completedAt) : 'N/A';
  const completionStatus = metrics?.completionStatus || 'Completed';
  
  // If this is a timer task, show additional metrics
  const pausedTime = metrics?.pausedTime ? formatDuration(metrics.pausedTime) : '0m';
  const netEffectiveTime = metrics?.netEffectiveTime ? formatDuration(metrics.netEffectiveTime) : 'N/A';
  const extensionTime = metrics?.extensionTime ? formatDuration(metrics.extensionTime) : '0m';
  
  // Get status color based on completion status
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-500';
    
    if (status.includes('Early')) return 'bg-green-500';
    if (status.includes('On Time')) return 'bg-blue-500';
    if (status.includes('Late')) return 'bg-amber-500';
    
    return 'bg-gray-500';
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="text-green-500">✓</span> Completed Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Task Name and Time */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{task.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <span>Completed: {completedAt}</span>
            </div>
          </div>
          
          <Separator />
          
          {/* Completion Status */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Completion Status</h3>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getStatusColor(completionStatus)}`}></span>
              <span className="font-medium">{completionStatus}</span>
            </div>
          </div>
          
          {/* Timer Task Metrics */}
          {isTimerTask && metrics && (
            <Card className="border border-border/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Timer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Time
                    </h4>
                    <div className="space-y-1">
                      <div className="grid grid-cols-2">
                        <span className="text-xs text-muted-foreground">Expected:</span>
                        <span className="text-xs font-medium">{expectedTime}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-xs text-muted-foreground">Actual:</span>
                        <span className="text-xs font-medium">{actualTime}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-xs text-muted-foreground">Effective:</span>
                        <span className="text-xs font-medium">{netEffectiveTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-medium flex items-center gap-1 mb-2 text-muted-foreground">
                      <Pause className="h-4 w-4" />
                      Breaks
                    </h4>
                    <div className="space-y-1">
                      <div className="grid grid-cols-2">
                        <span className="text-xs text-muted-foreground">Count:</span>
                        <span className="text-xs font-medium">{pauseCount}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-xs text-muted-foreground">Paused Time:</span>
                        <span className="text-xs font-medium">{pausedTime}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-xs text-muted-foreground">Extensions:</span>
                        <span className="text-xs font-medium">{extensionTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium flex items-center gap-1 mb-2 text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    Efficiency
                  </h4>
                  <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full"
                      style={{ width: efficiency }}
                    />
                  </div>
                  <div className="mt-1 text-xs font-medium text-right">{efficiency}</div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notes section - if there are any */}
          {task.notes && task.notes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <div className="bg-muted/50 rounded-md p-3 text-sm">
                {task.notes}
              </div>
            </div>
          )}
          
          {/* Tags - if any */}
          {task.tags && task.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
