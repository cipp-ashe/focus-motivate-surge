
import { TimerStateMetrics } from '@/types/metrics';

// Calculate average session duration
export const calculateAverageDuration = (metrics: TimerStateMetrics[]): number => {
  if (!metrics.length) return 0;
  
  const completedSessions = metrics.filter(m => m.completionStatus === 'completed');
  if (!completedSessions.length) return 0;
  
  const totalDuration = completedSessions.reduce((total, m) => total + m.actualDuration, 0);
  return Math.round(totalDuration / completedSessions.length);
};

// Calculate completion rate
export const calculateCompletionRate = (metrics: TimerStateMetrics[]): number => {
  if (!metrics.length) return 0;
  
  const completedSessions = metrics.filter(m => m.completionStatus === 'completed');
  return Math.round((completedSessions.length / metrics.length) * 100);
};

// Calculate average efficiency
export const calculateAverageEfficiency = (metrics: TimerStateMetrics[]): number => {
  if (!metrics.length) return 0;
  
  const metricsWithEfficiency = metrics.filter(m => 
    typeof m.efficiencyRatio === 'number' && m.completionStatus === 'completed'
  );
  
  if (!metricsWithEfficiency.length) return 0;
  
  const totalEfficiency = metricsWithEfficiency.reduce(
    (total, m) => total + (m.efficiencyRatio || 0), 
    0
  );
  
  return Math.round((totalEfficiency / metricsWithEfficiency.length) * 100);
};

// Calculate metrics by day
export const calculateMetricsByDay = (metrics: TimerStateMetrics[], days = 7): Array<{name: string, value: number}> => {
  if (!metrics.length) return [];
  
  const today = new Date();
  const result = [];
  
  // Create an array of the last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Count completed sessions for this day
    const dayCompletions = metrics.filter(m => {
      if (!m.completionDate) return false;
      const metricDate = new Date(m.completionDate);
      return metricDate.getDate() === date.getDate() &&
             metricDate.getMonth() === date.getMonth() &&
             metricDate.getFullYear() === date.getFullYear();
    });
    
    result.push({
      name: dayStr,
      value: dayCompletions.length,
    });
  }
  
  return result;
};

// Calculate pause frequency
export const calculateAveragePauses = (metrics: TimerStateMetrics[]): number => {
  if (!metrics.length) return 0;
  
  const metricsWithPauses = metrics.filter(m => 
    typeof m.pauseCount === 'number' && m.completionStatus === 'completed'
  );
  
  if (!metricsWithPauses.length) return 0;
  
  const totalPauses = metricsWithPauses.reduce(
    (total, m) => total + (m.pauseCount || 0), 
    0
  );
  
  return Math.round(totalPauses / metricsWithPauses.length * 10) / 10;
};

// Calculate total productive time
export const calculateTotalProductiveTime = (metrics: TimerStateMetrics[]): number => {
  if (!metrics.length) return 0;
  
  return metrics
    .filter(m => m.completionStatus === 'completed')
    .reduce((total, m) => total + m.actualDuration, 0);
};
