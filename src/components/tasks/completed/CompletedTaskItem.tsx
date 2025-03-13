
import React, { useState } from 'react';
import { Task } from '@/types/tasks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2, ChevronRight, Timer, BarChart, CalendarClock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompletedTaskDialog } from '../CompletedTaskDialog';
import { formatDuration, getCompletionTimingClass, determineCompletionStatus, calculateEfficiencyRatio } from '@/lib/utils/formatters';
import { formatDistanceToNow } from 'date-fns';

interface CompletedTaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export const CompletedTaskItem: React.FC<CompletedTaskItemProps> = ({ 
  task, 
  onDelete 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isDismissed = !!task.dismissedAt;
  const isTimerTask = task.taskType === 'timer';
  
  // Format metrics for compact display
  const timeSpent = task.metrics?.actualDuration 
    ? formatDuration(task.metrics.actualDuration) 
    : (task.metrics?.timeSpent ? formatDuration(task.metrics.timeSpent) : null);
  
  const efficiency = task.metrics?.efficiencyRatio 
    ? `${Math.round(task.metrics.efficiencyRatio * 100)}%` 
    : null;
  
  // Calculate how long the task took to complete from creation to completion
  const getCompletionTimeframe = () => {
    if (!task.completedAt || !task.createdAt) return null;
    
    const completedDate = new Date(task.completedAt);
    const createdDate = new Date(task.createdAt);
    
    return formatDistanceToNow(createdDate, { addSuffix: true });
  };
  
  // Determine completion timing status based on expected vs actual duration
  const getCompletionTimingStatus = () => {
    if (!task.metrics?.efficiencyRatio) return null;
    
    const status = determineCompletionStatus(task.metrics.efficiencyRatio);
    return { 
      label: status.replace('Completed ', ''), 
      className: getCompletionTimingClass(status)
    };
  };
  
  const completionTimeframe = getCompletionTimeframe();
  const timingStatus = getCompletionTimingStatus();
  
  return (
    <>
      <div 
        className={cn(
          "p-3 rounded-lg border transition-all duration-200 animate-fade-in",
          "flex items-start gap-3 group cursor-pointer",
          isDismissed 
            ? "bg-orange-50/5 border-orange-200/20 dark:bg-orange-900/5 hover:bg-orange-50/10" 
            : "bg-green-50/5 border-green-200/20 dark:bg-green-900/5 hover:bg-green-50/10"
        )}
        onClick={() => setShowDetails(true)}
      >
        {isDismissed ? (
          <div className="bg-orange-100/10 p-2 rounded-full">
            <XCircle className="h-5 w-5 text-orange-500/90 flex-shrink-0" />
          </div>
        ) : (
          <div className="bg-green-100/10 p-2 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-500/90 flex-shrink-0" />
          </div>
        )}
        
        <div className="flex-1 text-left">
          <p className="font-medium text-foreground">{task.name}</p>
          <div className="flex flex-wrap gap-2 mt-1 items-center">
            {task.relationships?.habitId && (
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/30">
                Habit
              </Badge>
            )}
            {task.relationships?.templateId && (
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/30">
                Template
              </Badge>
            )}
            
            {/* Display completion timing status if available */}
            {timingStatus && !isDismissed && (
              <Badge variant="outline" className={`text-xs ${timingStatus.className}`}>
                {timingStatus.label}
              </Badge>
            )}
            
            <span className="text-xs text-muted-foreground">
              {isDismissed ? 'Dismissed' : 'Completed'}
            </span>
            
            {/* Show completion timeframe */}
            {completionTimeframe && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                {completionTimeframe}
              </span>
            )}
            
            {/* Show metrics for timer tasks */}
            {isTimerTask && timeSpent && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="h-3 w-3" />
                {timeSpent}
              </span>
            )}
            
            {isTimerTask && efficiency && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BarChart className="h-3 w-3" />
                {efficiency}
              </span>
            )}
            
            {/* Show date completed */}
            {task.completedAt && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(task.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="h-8 w-8 rounded-full text-destructive opacity-70 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
        </div>
      </div>
      
      {/* Task details dialog */}
      <CompletedTaskDialog 
        task={task}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
};

export default CompletedTaskItem;
