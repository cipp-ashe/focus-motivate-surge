
import React from 'react';
import { HabitDetail } from '@/types/habits/types';
import { HabitRow } from './HabitRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TodaysHabitsSectionProps {
  todaysHabits: HabitDetail[];
  completedHabits: string[];
  dismissedHabits: string[];
  onHabitComplete: (habitId: string) => void;
  onAddHabitToTasks?: (habit: HabitDetail) => void;
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
  // Filter out dismissed habits
  const habitsToShow = todaysHabits.filter(
    habit => !dismissedHabits.includes(habit.id)
  );

  if (habitsToShow.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          <p>No habits scheduled for today</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle>Today's Habits</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-[calc(100vh-12rem-8rem)]">
          <div className="space-y-3 pr-3">
            {habitsToShow.map(habit => (
              <HabitRow
                key={habit.id}
                habit={habit}
                isCompleted={completedHabits.includes(habit.id)}
                onComplete={() => onHabitComplete(habit.id)}
                onAddToTasks={onAddHabitToTasks}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
