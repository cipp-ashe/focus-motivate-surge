
import React from 'react';
import { HabitDetail } from '@/types/habits';
import { HabitMetric } from './HabitMetric';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface HabitRowProps {
  habit: HabitDetail;
  isCompleted?: boolean;
  onComplete: () => void;
  onAddToTasks?: (habit: HabitDetail) => void;
  onDismiss?: () => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  isCompleted = false,
  onComplete,
  onAddToTasks,
  onDismiss
}) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">{habit.name}</h3>
              {onDismiss && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDismiss}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              )}
            </div>
            {habit.description && (
              <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-muted-foreground">
                {habit.timePreference || 'Anytime'}
              </div>
              {habit.category && (
                <div className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {habit.category}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex gap-2">
          <HabitMetric 
            habitId={habit.id}
            date={new Date().toISOString()}
            metricType={habit.metrics.type}
            value={habit.metrics.type === 'boolean' ? true : (habit.metrics.target || 1)}
            habitName={habit.name}
            templateId={habit.relationships?.templateId}
          />
          
          {onAddToTasks && !isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToTasks(habit)}
              className="whitespace-nowrap"
            >
              Add to Tasks
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
