
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
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
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Best Streak
        </Typography>
        <Typography variant="h4" color="primary">
          {getBestStreak()} days
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Keep building your momentum!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BestStreak;
