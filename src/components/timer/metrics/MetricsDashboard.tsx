
import React, { useState, useEffect } from 'react';
import { 
  TimerStateMetrics 
} from '@/types/metrics';
import { 
  Clock, 
  BarChart, 
  Gauge, 
  Repeat, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { MetricsChart } from './MetricsChart';
import { EfficiencyGauge } from './EfficiencyGauge';
import { MetricsHistory } from './MetricsHistory';
import { formatTime } from '@/lib/utils';
import { 
  calculateAverageDuration,
  calculateCompletionRate,
  calculateAverageEfficiency,
  calculateMetricsByDay,
  calculateAveragePauses,
  calculateTotalProductiveTime
} from '@/utils/metricsCalculator';
import { cn } from '@/lib/utils';

interface MetricsDashboardProps {
  metrics: TimerStateMetrics[];
  className?: string;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ 
  metrics, 
  className 
}) => {
  // Derived metrics
  const [averageDuration, setAverageDuration] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [averageEfficiency, setAverageEfficiency] = useState(0);
  const [dailyMetrics, setDailyMetrics] = useState<Array<{name: string, value: number}>>([]);
  const [averagePauses, setAveragePauses] = useState(0);
  const [totalProductiveTime, setTotalProductiveTime] = useState(0);

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      setAverageDuration(calculateAverageDuration(metrics));
      setCompletionRate(calculateCompletionRate(metrics));
      setAverageEfficiency(calculateAverageEfficiency(metrics));
      setDailyMetrics(calculateMetricsByDay(metrics));
      setAveragePauses(calculateAveragePauses(metrics));
      setTotalProductiveTime(calculateTotalProductiveTime(metrics));
    }
  }, [metrics]);

  if (!metrics || metrics.length === 0) {
    return (
      <div className={cn("p-6 text-center rounded-lg border border-border/40 bg-background/50 dark:bg-gray-800/50", className)}>
        <p className="text-muted-foreground dark:text-gray-400">
          No timer metrics available yet. Complete some timer sessions to see your stats.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard 
          title="Avg. Session Duration" 
          value={formatTime(averageDuration)}
          icon={<Clock className="h-5 w-5 text-primary dark:text-primary" />}
          description="Average time spent per completed session"
          className="animate-fade-in" 
        />
        
        <MetricCard 
          title="Completion Rate" 
          value={`${completionRate}%`}
          icon={<CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />}
          description="Percentage of sessions completed"
          className="animate-fade-in [animation-delay:100ms]" 
        />
        
        <MetricCard 
          title="Total Productive Time" 
          value={formatDurationHourMinute(totalProductiveTime)}
          icon={<Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
          description="Total time spent on completed tasks"
          className="animate-fade-in [animation-delay:200ms]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in [animation-delay:300ms]">
          <h3 className="text-sm font-semibold text-foreground dark:text-white mb-3">
            Completed Sessions by Day
          </h3>
          <MetricsChart 
            data={dailyMetrics} 
            height={220}
            barColor="var(--primary)" 
          />
        </div>
        
        <div className="flex flex-col space-y-4 animate-fade-in [animation-delay:400ms]">
          <h3 className="text-sm font-semibold text-foreground dark:text-white">
            Overall Efficiency
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center bg-background/50 dark:bg-gray-800/50 rounded-lg border border-border/40 p-4">
            <EfficiencyGauge value={averageEfficiency} size="lg" />
            
            <div className="mt-4 w-full flex justify-between text-xs text-muted-foreground dark:text-gray-400">
              <span>Low</span>
              <span>Average</span>
              <span>High</span>
            </div>
            
            <div className="mt-6">
              <MetricCard 
                title="Avg. Pauses per Session" 
                value={averagePauses}
                icon={<Repeat className="h-5 w-5 text-amber-500 dark:text-amber-400" />}
                description="Average number of pauses during sessions"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in [animation-delay:500ms]">
        <MetricsHistory metrics={metrics} />
      </div>
    </div>
  );
};

const formatDurationHourMinute = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} minutes`;
};
