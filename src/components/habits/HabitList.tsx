
import React from 'react';
import { HabitCard } from './HabitCard';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Habit } from '@/types/habit';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onToggle }) => {
  const calculateProgress = () => {
    if (habits.length === 0) return 0;
    return (habits.filter((h) => h.completed).length / habits.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{Math.round(calculateProgress())}% Complete</span>
            <span>{habits.filter((h) => h.completed).length}/{habits.length} Habits</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <div key={habit.id} className="h-full">
            <HabitCard habit={habit} onToggle={onToggle} />
          </div>
        ))}
      </div>
    </div>
  );
};
