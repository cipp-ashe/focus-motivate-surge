import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Checkbox,
} from '@mui/material';
import { HabitDetail } from './types';

interface ProgressResult {
  value: boolean | number;
  streak: number;
}

interface HabitMetricProps {
  habit: HabitDetail;
  progress: ProgressResult;
  onUpdate: (value: boolean | number) => void;
}

const HabitMetric: React.FC<HabitMetricProps> = ({
  habit,
  progress,
  onUpdate,
}) => {
  const renderMetric = () => {
    switch (habit.metrics.type) {
      case 'boolean':
        return (
          <Checkbox
            checked={!!progress.value}
            onChange={(e) => onUpdate(e.target.checked)}
            size="small"
          />
        );
      case 'duration':
        const durationValue = typeof progress.value === 'number' ? progress.value : 0;
        const durationTarget = habit.metrics.target || 30;
        return (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={(durationValue / durationTarget) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {durationValue} / {durationTarget} min
            </Typography>
          </Box>
        );
      case 'count':
        const countValue = typeof progress.value === 'number' ? progress.value : 0;
        const countTarget = habit.metrics.target || 1;
        return (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={(countValue / countTarget) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {countValue} / {countTarget}
            </Typography>
          </Box>
        );
      case 'rating':
        const ratingValue = typeof progress.value === 'number' ? progress.value : 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <IconButton
                key={rating}
                size="small"
                onClick={() => onUpdate(rating)}
                color={rating <= ratingValue ? 'primary' : 'default'}
              >
                ★
              </IconButton>
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">{habit.name}</Typography>
        {progress.streak > 0 && (
          <Typography variant="caption" color="text.secondary">
            {progress.streak} day streak
          </Typography>
        )}
      </Box>
      {renderMetric()}
    </Box>
  );
};

export default HabitMetric;
