
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { HabitProgress } from '../types';

interface PreferredTimeProps {
  progress: HabitProgress[];
}

const PreferredTime: React.FC<PreferredTimeProps> = ({ progress }) => {
  const getPreferredTime = (): string => {
    const timeDistribution = progress.reduce((acc, p) => {
      const hour = new Date(p.date).getHours();
      if (typeof p.value === 'boolean' ? p.value : p.value > 0) {
        if (hour < 12) acc.morning++;
        else if (hour < 17) acc.afternoon++;
        else acc.evening++;
      }
      return acc;
    }, { morning: 0, afternoon: 0, evening: 0 });

    const max = Math.max(
      timeDistribution.morning,
      timeDistribution.afternoon,
      timeDistribution.evening
    );

    if (max === 0) return 'No data yet';
    if (max === timeDistribution.morning) return 'Morning';
    if (max === timeDistribution.afternoon) return 'Afternoon';
    return 'Evening';
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Most Successful Time
        </Typography>
        <Typography variant="h4" color="primary">
          {getPreferredTime()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You perform best during this time
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PreferredTime;
