
import React from 'react';
import { Task } from '@/types/tasks';
import { TableRow, TableCell } from '@/components/ui/table';
import { formatTime } from '@/utils/timeUtils';

interface TaskMetricsRowProps {
  task: Task;
}

export const TaskMetricsRow = ({ task }: TaskMetricsRowProps) => {
  if (!task.metrics) return null;
  
  const {
    expectedTime,
    actualDuration,
    pauseCount,
    efficiencyRatio,
    completionStatus
  } = task.metrics;

  return (
    <TableRow className="group bg-muted/30 border-b border-border/50">
      <TableCell colSpan={4} className="p-0">
        <div className="p-3 text-sm grid grid-cols-2 md:grid-cols-4 gap-3">
          {expectedTime && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Expected Time</p>
              <p className="font-medium">{expectedTime} min</p>
            </div>
          )}
          
          {typeof actualDuration !== 'undefined' && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Actual Time</p>
              <p className="font-medium">{actualDuration} min</p>
            </div>
          )}
          
          {typeof pauseCount !== 'undefined' && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Breaks Taken</p>
              <p className="font-medium">{pauseCount}</p>
            </div>
          )}
          
          {typeof efficiencyRatio !== 'undefined' && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Efficiency</p>
              <p className="font-medium">{efficiencyRatio.toFixed(1)}%</p>
            </div>
          )}
          
          {completionStatus && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <p className="font-medium">{completionStatus}</p>
            </div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
