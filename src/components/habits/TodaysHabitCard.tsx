
import React from 'react';
import { HabitDetail } from './types';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, ClipboardList, BookOpen, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TodaysHabitCardProps {
  habit: HabitDetail;
  completed: boolean;
  onComplete: (completed: boolean) => void;
  onAddToTasks: () => void;
  hasTask: boolean;
}

export const TodaysHabitCard: React.FC<TodaysHabitCardProps> = ({
  habit,
  completed,
  onComplete,
  onAddToTasks,
  hasTask
}) => {
  // Format duration for display (converts seconds to minutes)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };
  
  // Get icon based on habit type
  const getHabitIcon = () => {
    switch (habit.metrics.type) {
      case 'timer':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'journal':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return <Zap className="h-5 w-5 text-orange-500" />;
    }
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm transition-colors ${completed ? 'bg-muted/50' : 'bg-card'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox 
            id={`habit-${habit.id}`}
            checked={completed}
            onCheckedChange={onComplete}
            className="mt-1"
          />
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label 
                htmlFor={`habit-${habit.id}`}
                className={`font-medium text-base cursor-pointer ${completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {habit.name}
              </label>
              
              <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal">
                {getHabitIcon()}
                {habit.metrics.type === 'timer' && habit.metrics.target && formatDuration(habit.metrics.target)}
                {!habit.metrics.target && habit.metrics.type}
              </Badge>
            </div>
            
            {habit.description && (
              <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 ${hasTask ? 'text-muted-foreground' : ''}`}
          onClick={onAddToTasks}
          disabled={hasTask}
        >
          <ClipboardList className="h-4 w-4" />
          <span>{hasTask ? 'Added' : 'Add to Tasks'}</span>
        </Button>
      </div>
      
      {habit.tips && habit.tips.length > 0 && (
        <div className="mt-2 pl-10">
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground transition-colors">
              Tips & Reminders
            </summary>
            <ul className="pl-4 mt-1 list-disc space-y-1">
              {habit.tips.slice(0, 2).map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
};
