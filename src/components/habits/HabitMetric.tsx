
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { MetricType, HabitDetail } from '@/types/habits/types';
import { eventManager } from '@/lib/events/EventManager';

interface HabitMetricProps {
  habit: HabitDetail;
  isCompleted: boolean;
  onComplete: () => void;
}

export const HabitMetric: React.FC<HabitMetricProps> = ({
  habit,
  isCompleted,
  onComplete
}) => {
  const [value, setValue] = useState<number | string>('');
  const metricType = habit.metrics?.type || 'boolean';
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  const handleComplete = () => {
    // Different handling based on metric type
    const completionPayload = {
      habitId: habit.id,
      date: today,
      value: metricType === 'boolean' ? true : value,
      metricType,
      habitName: habit.name,
      templateId: habit.relationships?.templateId
    };
    
    // Emit habit completion event
    eventManager.emit('habit:complete', completionPayload);
    
    onComplete();
  };
  
  const handleJournalOpen = () => {
    // Emit event to open journal
    eventManager.emit('journal:open', {
      habitId: habit.id,
      habitName: habit.name,
      date: today,
      templateId: habit.relationships?.templateId
    });
  };
  
  const handleScheduleTimer = () => {
    // If the habit has a predefined duration, use that
    const duration = habit.metrics?.goal || 25 * 60; // Default 25 minutes
    
    // Emit event to schedule timer task for this habit
    eventManager.emit('habit:schedule', {
      habitId: habit.id,
      name: habit.name,
      duration: duration,
      templateId: habit.relationships?.templateId || '',
      date: today,
      metricType: habit.metrics?.type
    });
  };
  
  // Render appropriate metric UI based on type
  const renderMetricUI = () => {
    if (isCompleted) {
      return <Button variant="outline" disabled className="w-full">Completed</Button>;
    }
    
    switch (metricType) {
      case 'boolean':
        return (
          <Button 
            onClick={handleComplete}
            variant="default"
            className="w-full"
          >
            Complete
          </Button>
        );
        
      case 'number':
      case 'counter':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={value.toString()}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder={`Enter ${habit.metrics?.unit || 'value'}`}
              min={habit.metrics?.min}
              max={habit.metrics?.max}
            />
            <Button 
              onClick={handleComplete}
              variant="default"
              className="w-full"
              disabled={value === ''}
            >
              Complete
            </Button>
          </div>
        );
        
      case 'slider':
      case 'rating':
        return (
          <div className="space-y-4">
            <Slider
              value={[typeof value === 'number' ? value : 0]}
              onValueChange={(vals) => setValue(vals[0])}
              min={habit.metrics?.min || 0}
              max={habit.metrics?.max || 10}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{habit.metrics?.min || 0}</span>
              <span>{habit.metrics?.max || 10}</span>
            </div>
            <Button 
              onClick={handleComplete}
              variant="default"
              className="w-full"
            >
              Complete
            </Button>
          </div>
        );
        
      case 'timer':
        return (
          <Button 
            onClick={handleScheduleTimer}
            variant="default"
            className="w-full"
          >
            Start Timer ({Math.floor((habit.metrics?.goal || 25 * 60) / 60)} min)
          </Button>
        );
        
      case 'journal':
        return (
          <Button 
            onClick={handleJournalOpen}
            variant="default"
            className="w-full"
          >
            Open Journal
          </Button>
        );
        
      default:
        return (
          <Button 
            onClick={handleComplete}
            variant="default"
            className="w-full"
          >
            Complete
          </Button>
        );
    }
  };
  
  return <div className="mt-2">{renderMetricUI()}</div>;
};
