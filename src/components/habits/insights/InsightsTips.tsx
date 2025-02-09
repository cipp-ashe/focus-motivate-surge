
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
} from '@mui/material';
import { HabitDetail } from '../types';

interface InsightsTipsProps {
  habit: HabitDetail;
}

const InsightsTips: React.FC<InsightsTipsProps> = ({ habit }) => {
  return (
    <Card elevation={0}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Insights & Tips
        </Typography>
        <Stack spacing={2}>
          {habit.insights.map((insight, index) => (
            <Box key={index}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                {insight.type === 'streak' ? '🔥' :
                 insight.type === 'completion' ? '✅' :
                 insight.type === 'timing' ? '⏰' : '🔄'} {insight.description}
              </Typography>
            </Box>
          ))}
          {habit.tips.map((tip, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              💡 {tip}
            </Typography>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InsightsTips;
