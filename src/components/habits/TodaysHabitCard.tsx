
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Plus, AlarmClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HabitDetail } from '@/types/habits/types';
import { cn } from '@/lib/utils';

interface TodaysHabitCardProps {
  habit: HabitDetail;
  isCompleted: boolean;
  onComplete: () => void;
  onAddToTasks: () => void;
}

const TodaysHabitCard: React.FC<TodaysHabitCardProps> = ({
  habit,
  isCompleted,
  onComplete,
  onAddToTasks
}) => {
  return (
    <Card 
      className={cn(
        "transition-all border",
        isCompleted 
          ? "bg-muted/30 border-green-500/20"
          : "hover:bg-accent/5"
      )}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className={cn(
              "text-sm font-medium",
              isCompleted && "text-muted-foreground line-through"
            )}>
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {habit.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={isCompleted ? "outline" : "default"}
              className="h-8 w-8 p-0 rounded-full"
              onClick={onComplete}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">
                {isCompleted ? "Mark incomplete" : "Mark complete"}
              </span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 rounded-full"
              onClick={onAddToTasks}
            >
              {habit.metrics.type === 'timer' ? (
                <AlarmClock className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span className="sr-only">Add to tasks</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysHabitCard;
