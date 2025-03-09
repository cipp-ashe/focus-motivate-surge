
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitDetail } from './types';
import HabitMetric from './HabitMetric';
import { Checkbox } from "@/components/ui/checkbox";
import { Timer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { eventBus } from '@/lib/eventBus';
import { useTaskContext } from '@/contexts/tasks/TaskContext';

interface TodaysHabitCardProps {
  habits: HabitDetail[];
  completedHabits: string[];
  onHabitComplete: (habit: HabitDetail, templateId?: string) => void;
  onAddHabitToTasks: (habit: HabitDetail) => void;
  templateId?: string;
}

const TodaysHabitCard: React.FC<TodaysHabitCardProps> = ({
  habits,
  completedHabits,
  onHabitComplete,
  onAddHabitToTasks,
  templateId
}) => {
  const { items: tasks } = useTaskContext();
  
  if (!habits || habits.length === 0) {
    return null;
  }

  const handleStartTimer = (habit: HabitDetail) => {
    // Find if there's a task for this habit today
    const today = new Date().toDateString();
    const relatedTask = tasks.find(task => 
      task.relationships?.habitId === habit.id && 
      task.relationships?.date === today
    );
    
    if (relatedTask) {
      // Start the timer for this task
      eventBus.emit('task:select', relatedTask.id);
      // Send timer start event with task duration
      eventBus.emit('timer:start', { 
        taskName: relatedTask.name, 
        duration: relatedTask.duration || 1500 
      });
      // Expand timer view
      eventBus.emit('timer:expand', { taskName: relatedTask.name });
    } else {
      // Create a task for this habit and start timer
      onAddHabitToTasks(habit);
    }
  };

  return (
    <Card className="bg-card/50 border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Today's Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {habits.map(habit => (
            <div 
              key={habit.id}
              className="flex items-center justify-between py-2 border-b last:border-none"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  id={`habit-${habit.id}`}
                  checked={completedHabits.includes(habit.id)}
                  onCheckedChange={() => onHabitComplete(habit, templateId)}
                  className="h-5 w-5"
                />
                <div>
                  <label 
                    htmlFor={`habit-${habit.id}`} 
                    className={`font-medium cursor-pointer ${completedHabits.includes(habit.id) ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {habit.name}
                  </label>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  )}
                </div>
              </div>
              
              {/* For timer habits, add a timer button that starts the timer directly */}
              {habit.metrics.type === 'timer' && (
                <div className="flex items-center gap-2 mr-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => handleStartTimer(habit)}
                    title="Start Timer"
                  >
                    <Timer className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              
              {/* Special habit types still use HabitMetric */}
              {habit.metrics.type !== 'boolean' && habit.metrics.type !== 'timer' && (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <HabitMetric
                      habit={habit}
                      progress={{
                        value: completedHabits.includes(habit.id),
                        streak: 0
                      }}
                      onUpdate={(value) => {
                        if (value) {
                          onHabitComplete(habit, templateId);
                        } else {
                          onHabitComplete(habit, templateId);
                        }
                      }}
                      templateId={templateId}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysHabitCard;
