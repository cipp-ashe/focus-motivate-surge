
import React from 'react';
import { MetricType } from '@/types/habits';
import { eventManager } from '@/lib/events/EventManager';

interface HabitMetricProps {
  habitId: string;
  date: string;
  metricType: MetricType;
  value: boolean | number;
  habitName: string;
  templateId?: string;
}

export const HabitMetric: React.FC<HabitMetricProps> = ({
  habitId,
  date,
  metricType,
  value,
  habitName,
  templateId
}) => {
  const handleComplete = () => {
    // Emit completion event with proper typing
    eventManager.emit('habit:complete', {
      habitId,
      date,
      value: metricType === 'boolean' ? true : (value as number),
      metricType,
      habitName,
      templateId: templateId || ''
    });
  };

  return (
    <div>
      <button 
        onClick={handleComplete}
        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm transition-colors"
      >
        Complete {habitName}
      </button>
    </div>
  );
};
