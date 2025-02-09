
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { HabitProgress } from '../types';

interface CompletionRateProps {
  progress: HabitProgress[];
}

const CompletionRate: React.FC<CompletionRateProps> = ({ progress }) => {
  const theme = useTheme();

  const getCompletionRate = (): number => {
    const totalDays = progress.length;
    if (totalDays === 0) return 0;

    const completedDays = progress.filter(p => 
      typeof p.value === 'boolean' ? p.value : p.value > 0
    ).length;

    return (completedDays / totalDays) * 100;
  };

  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Completion Rate
        </Typography>
        <Box sx={{ position: 'relative', pt: 2 }}>
          <LinearProgress
            variant="determinate"
            value={getCompletionRate()}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
              },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: theme.palette.text.secondary,
            }}
          >
            {Math.round(getCompletionRate())}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompletionRate;
