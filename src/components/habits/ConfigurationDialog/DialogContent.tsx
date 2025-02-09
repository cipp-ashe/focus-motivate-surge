
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { HabitDetail, DayOfWeek } from '../../types';
import DaySelector from './DaySelector';
import DraggableHabitList from './DraggableHabitList';

interface DialogContentProps {
  habits: HabitDetail[];
  draggedIndex: number | null;
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
  onAddHabit: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onUpdateHabit: (index: number, updates: Partial<HabitDetail>) => void;
  onDeleteHabit: (index: number) => void;
}

const DialogContent: React.FC<DialogContentProps> = ({
  habits,
  draggedIndex,
  activeDays,
  onUpdateDays,
  onAddHabit,
  onDragStart,
  onDragOver,
  onDragEnd,
  onUpdateHabit,
  onDeleteHabit,
}) => {
  return (
    <>
      <DaySelector activeDays={activeDays} onUpdateDays={onUpdateDays} />
      
      <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">Configure Habits</Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddHabit}
        >
          Add Habit
        </Button>
      </Box>

      <Box>
        <DraggableHabitList
          habits={habits}
          draggedIndex={draggedIndex}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onUpdateHabit={onUpdateHabit}
          onDeleteHabit={onDeleteHabit}
        />
      </Box>
    </>
  );
};

export default DialogContent;
