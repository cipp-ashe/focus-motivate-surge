
import React from 'react';
import { formatDateTime } from '@/lib/utils/dateUtils';
import { TimerStateMetrics } from '@/types/metrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface MetricsHistoryProps {
  metrics: TimerStateMetrics[];
  className?: string;
}

export const MetricsHistory: React.FC<MetricsHistoryProps> = ({ metrics, className }) => {
  const completedMetrics = metrics.filter(m => m.completionStatus === 'completed');
  
  if (!completedMetrics.length) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground dark:text-gray-400", className)}>
        No completed timer sessions yet.
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border/40 bg-background/50 dark:bg-gray-800/50", className)}>
      <Tabs defaultValue="all">
        <div className="p-4 border-b border-border/40">
          <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3">Timer Session History</h3>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="p-0">
          <HistoryTable metrics={metrics} />
        </TabsContent>
        
        <TabsContent value="completed" className="p-0">
          <HistoryTable metrics={metrics.filter(m => m.completionStatus === 'completed')} />
        </TabsContent>
        
        <TabsContent value="abandoned" className="p-0">
          <HistoryTable metrics={metrics.filter(m => m.completionStatus === 'abandoned')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const HistoryTable: React.FC<{ metrics: TimerStateMetrics[] }> = ({ metrics }) => {
  return (
    <div className="overflow-auto max-h-80">
      <table className="w-full border-collapse">
        <thead className="bg-muted/50 dark:bg-gray-700/50">
          <tr>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-400">Date</th>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-400">Task</th>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-400">Duration</th>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-400">Status</th>
            <th className="p-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-400">Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => {
            const date = metric.completionDate || metric.endTime || metric.startTime;
            return (
              <tr key={index} className="border-t border-border/40 hover:bg-muted/30 dark:hover:bg-gray-700/30">
                <td className="p-3 text-xs text-foreground dark:text-gray-300">
                  {date ? formatDateTime(date) : 'N/A'}
                </td>
                <td className="p-3 text-xs text-foreground dark:text-gray-300 max-w-[150px] truncate">
                  {metric.taskId || 'Untitled Task'}
                </td>
                <td className="p-3 text-xs text-foreground dark:text-gray-300">
                  {formatDuration(metric.actualDuration)}
                </td>
                <td className="p-3 text-xs">
                  <StatusBadge status={metric.completionStatus} />
                </td>
                <td className="p-3 text-xs text-foreground dark:text-gray-300">
                  {typeof metric.efficiencyRatio === 'number' 
                    ? `${Math.round(metric.efficiencyRatio * 100)}%` 
                    : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'completed' | 'abandoned' | 'extended' | null }> = ({ status }) => {
  if (!status) return <span className="text-muted-foreground dark:text-gray-400">In Progress</span>;
  
  const statusClasses = {
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    abandoned: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    extended: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  };
  
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusClasses[status])}>
      {status === 'completed' && 'Completed'}
      {status === 'abandoned' && 'Abandoned'}
      {status === 'extended' && 'Extended'}
    </span>
  );
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
