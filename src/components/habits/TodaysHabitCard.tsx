import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitDetail } from './types';
import HabitMetric from './HabitMetric';
import { Checkbox } from "@/components/ui/checkbox";

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
  if (!habits || habits.length === 0) {
    return null;
  }

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
              
              {/* Special habit types still use HabitMetric */}
              {habit.metrics.type !== 'boolean' && (
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
