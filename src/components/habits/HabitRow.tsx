import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { HabitDetail } from './types';
import HabitMetric from './HabitMetric';

interface HabitRowProps {
  habit: HabitDetail;
  value: boolean | number;
  onUpdate: (value: boolean | number) => void;
  onDelete?: () => void;
  dragHandleProps?: any;
}

const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  value,
  onUpdate,
  onDelete,
  dragHandleProps,
}) => {
  return (
    <Box sx={{ p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
      <Grid container spacing={2} alignItems="center">
        {dragHandleProps && (
          <Grid item>
            <Box {...dragHandleProps}>
              <DragIndicatorIcon sx={{ cursor: 'grab' }} />
            </Box>
          </Grid>
        )}
        {onDelete && (
          <Grid item>
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
        <Grid item xs>
          <Typography variant="subtitle2">{habit.name}</Typography>
        </Grid>
        <Grid item>
          <HabitMetric
            habit={habit}
            progress={{ value, streak: 0 }}
            onUpdate={onUpdate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HabitRow;
