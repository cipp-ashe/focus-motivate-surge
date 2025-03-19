
import React from 'react';
import { HabitDetail } from './types';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, ClipboardList, BookOpen, Zap, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { eventManager } from '@/lib/events/EventManager';

interface TodaysHabitCardProps {
  habit: HabitDetail;
  completed: boolean;
  dismissed?: boolean;
  onComplete: (completed: boolean) => void;
  onAddToTasks: () => void;
  hasTask: boolean;
}

export const TodaysHabitCard: React.FC<TodaysHabitCardProps> = ({
  habit,
  completed,
  dismissed = false,
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

  // Handle the add to tasks button click - directly emit the event
  const handleAddToTasks = () => {
    // First call the provided handler
    onAddToTasks();
    
    // Then directly emit the event for better reliability
    eventManager.emit('habit:schedule', {
      habitId: habit.id,
      templateId: habit.relationships?.templateId || '',
      name: habit.name,
      duration: habit.metrics.target || 1500, // Default to 25 minutes
      date: new Date().toDateString(),
      metricType: habit.metrics.type
    });
    
    // Force task update after a short delay
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 300);
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm transition-colors ${completed || dismissed ? 'bg-muted/50' : 'bg-card'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Checkbox 
            id={`habit-${habit.id}`}
            checked={completed || dismissed}
            onCheckedChange={onComplete}
            className="mt-1"
            disabled={dismissed}
          />
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label 
                htmlFor={`habit-${habit.id}`}
                className={`font-medium text-base cursor-pointer ${(completed || dismissed) ? 'line-through text-muted-foreground' : ''}`}
              >
                {habit.name}
              </label>
              
              <div className="flex gap-1.5">
                <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal">
                  {getHabitIcon()}
                  {habit.metrics.type === 'timer' && habit.metrics.target && formatDuration(habit.metrics.target)}
                  {!habit.metrics.target && habit.metrics.type}
                </Badge>
                
                {dismissed && (
                  <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200/30">
                    <XCircle className="h-3 w-3" />
                    Dismissed
                  </Badge>
                )}
              </div>
            </div>
            
            {habit.description && (
              <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 ${hasTask || dismissed ? 'text-muted-foreground' : ''}`}
          onClick={handleAddToTasks}
          disabled={hasTask || dismissed}
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
