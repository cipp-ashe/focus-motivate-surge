import React from 'react';
import {
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { HabitDetail } from '../../types';

interface HabitFormProps {
  habit: HabitDetail;
  onUpdate: (updates: Partial<HabitDetail>) => void;
  onDelete: () => void;
  onDragStart?: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  onUpdate,
  onDelete,
  onDragStart,
}) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
          touchAction: 'none',
          userSelect: 'none',
        }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <DragIndicatorIcon />
      </Box>
    </Grid>
    <Grid item>
      <IconButton
        size="small"
        onClick={onDelete}
        aria-label="Delete habit"
      >
        <DeleteIcon />
      </IconButton>
    </Grid>
    <Grid item xs>
      <TextField
        fullWidth
        size="small"
        label="Habit Name"
        value={habit.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        inputProps={{
          'aria-label': 'Habit name',
        }}
      />
    </Grid>
    <Grid item xs={3}>
      <TextField
        fullWidth
        size="small"
        select
        label="Tracking Type"
        value={habit.metrics.type}
        onChange={(e) => {
          const type = e.target.value as 'boolean' | 'duration' | 'count' | 'rating';
          onUpdate({
            metrics: {
              type,
              ...(type === 'duration' && { unit: 'minutes', min: 5, target: 30 }),
              ...(type === 'count' && { target: 1 }),
              ...(type === 'rating' && { min: 1, max: 5 }),
            },
          });
        }}
        inputProps={{
          'aria-label': 'Tracking type',
        }}
      >
        <MenuItem value="boolean">Checkbox</MenuItem>
        <MenuItem value="duration">Duration</MenuItem>
        <MenuItem value="count">Counter</MenuItem>
        <MenuItem value="rating">Rating</MenuItem>
      </TextField>
    </Grid>
    {habit.metrics.type !== 'boolean' && (
      <Grid item xs={2}>
        <TextField
          fullWidth
          size="small"
          label="Target"
          type="number"
          value={habit.metrics.target || ''}
          onChange={(e) => onUpdate({
            metrics: {
              ...habit.metrics,
              target: parseInt(e.target.value),
            },
          })}
          inputProps={{
            'aria-label': 'Target value',
            min: habit.metrics.type === 'duration' ? 5 : 1,
            max: habit.metrics.type === 'rating' ? 5 : undefined,
          }}
        />
      </Grid>
    )}
  </Grid>
);

export default HabitForm;
