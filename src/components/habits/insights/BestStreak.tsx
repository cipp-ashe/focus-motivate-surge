
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitProgress } from '../types';

interface BestStreakProps {
  progress: HabitProgress[];
}

const BestStreak: React.FC<BestStreakProps> = ({ progress }) => {
  const getBestStreak = (): number => {
    let currentStreak = 0;
    let bestStreak = 0;
    let lastDate: Date | null = null;

    progress
      .filter(p => typeof p.value === 'boolean' ? p.value : p.value > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(p => {
        const currentDate = new Date(p.date);
        
        if (!lastDate || 
            (lastDate.getTime() + 24 * 60 * 60 * 1000) === currentDate.getTime()) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }

        if (currentStreak > bestStreak) {
          bestStreak = currentStreak;
        }

        lastDate = currentDate;
      });

    return bestStreak;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Best Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {getBestStreak()} days
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Keep building your momentum!
        </p>
      </CardContent>
    </Card>
  );
};

export default BestStreak;
