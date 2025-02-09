import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { HabitDetail } from '../../types';
import HabitForm from './HabitForm';

interface DraggableHabitListProps {
  habits: HabitDetail[];
  draggedIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onUpdateHabit: (index: number, updates: Partial<HabitDetail>) => void;
  onDeleteHabit: (index: number) => void;
}

const DraggableHabitList: React.FC<DraggableHabitListProps> = ({
  habits,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onUpdateHabit,
  onDeleteHabit,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      {habits.map((habit, index) => (
        <Paper
          key={habit.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          elevation={draggedIndex === index ? 4 : 1}
          sx={{
            mb: 1,
            p: 2,
            cursor: 'grab',
            transform: draggedIndex === index ? 'scale(1.02)' : 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
            zIndex: draggedIndex === index ? 1 : 'auto',
            opacity: draggedIndex === index ? 0.8 : 1,
            '&:hover': { boxShadow: 2 },
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <HabitForm
            habit={habit}
            onUpdate={(updates) => onUpdateHabit(index, updates)}
            onDelete={() => onDeleteHabit(index)}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default DraggableHabitList;
