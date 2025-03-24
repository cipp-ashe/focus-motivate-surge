
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TodaysHabitCard from './TodaysHabitCard';
import { HabitDetail } from '@/types/habits/types';
import { useHabitTaskProcessor } from '@/hooks/tasks/habitTasks/useHabitTaskProcessor';

interface TodaysHabitsSectionProps {
  todaysHabits: HabitDetail[];
  completedHabits: string[];
  dismissedHabits: string[];
  onHabitComplete: (habitId: string) => boolean;
  onAddHabitToTasks: (habit: HabitDetail) => boolean;
  templateId?: string;
}

export const TodaysHabitsSection: React.FC<TodaysHabitsSectionProps> = ({ 
  todaysHabits,
  completedHabits,
  dismissedHabits,
  onHabitComplete,
  onAddHabitToTasks,
  templateId
}) => {
  const { handleHabitSchedule } = useHabitTaskProcessor();
  
  // No habits case
  if (todaysHabits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No habits scheduled for today</p>
            <Button variant="outline" className="mt-4">Add Habit Template</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaysHabits.map(habit => (
            <TodaysHabitCard
              key={habit.id}
              habit={habit}
              isCompleted={completedHabits.includes(habit.id)}
              onComplete={() => onHabitComplete(habit.id)}
              onAddToTasks={() => onAddHabitToTasks(habit)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysHabitsSection;
