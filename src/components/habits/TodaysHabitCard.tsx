
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitDetail } from './types';
import HabitMetric from './HabitMetric';

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
              <div className="flex-1">
                <h3 className="font-medium">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                )}
              </div>
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysHabitCard;
