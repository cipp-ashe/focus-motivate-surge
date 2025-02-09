
import React from 'react';
import { Box, Grid } from '@mui/material';
import { HabitDetail, HabitProgress } from './types';
import CompletionRate from './insights/CompletionRate';
import BestStreak from './insights/BestStreak';
import PreferredTime from './insights/PreferredTime';
import ProgressChart from './insights/ProgressChart';
import InsightsTips from './insights/InsightsTips';

interface HabitInsightsProps {
  habit: HabitDetail;
  progress: HabitProgress[];
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habit, progress }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <CompletionRate progress={progress} />
        </Grid>
        <Grid item xs={12} md={4}>
          <BestStreak progress={progress} />
        </Grid>
        <Grid item xs={12} md={4}>
          <PreferredTime progress={progress} />
        </Grid>
        <Grid item xs={12}>
          <ProgressChart habit={habit} progress={progress} />
        </Grid>
        <Grid item xs={12}>
          <InsightsTips habit={habit} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HabitInsights;
