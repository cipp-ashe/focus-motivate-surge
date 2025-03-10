
import React from 'react';
import { Task } from '@/types/tasks';
import { Clock, BarChart3, Pause, Target } from 'lucide-react';

export interface TaskMetricsRowProps {
  // Original props
  label?: string;
  value?: string;
  icon?: React.ReactNode;
  
  // Alternative task prop
  task?: Task;
  
  // Added for consistency with other components
  title?: string;
}

export const TaskMetricsRow: React.FC<TaskMetricsRowProps> = ({
  label,
  value,
  icon,
  task,
  title
}) => {
  // If task is provided, render task metrics row
  if (task && task.metrics) {
    const metrics = task.metrics;
    const timeSpent = metrics.timeSpent ? `${Math.floor(metrics.timeSpent / 60)}m` : '-';
    const pauseCount = metrics.pauseCount || '0';
    const efficiency = metrics.efficiencyRatio 
      ? `${(metrics.efficiencyRatio * 100).toFixed(0)}%`
      : '-';
      
    return (
      <tr className="bg-muted/30 border-t-0 hover:bg-transparent">
        <td colSpan={4}>
          <div className="grid grid-cols-3 gap-4 py-2 px-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Time: {timeSpent}</span>
            </div>
            <div className="flex items-center gap-1">
              <Pause className="h-3 w-3" />
              <span>Pauses: {pauseCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>Efficiency: {efficiency}</span>
            </div>
          </div>
        </td>
      </tr>
    );
  }
  
  // Original rendering logic
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        {icon && icon}
        {label || title}
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
};
