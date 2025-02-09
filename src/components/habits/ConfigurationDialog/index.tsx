import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { HabitDetail, DayOfWeek } from '../../types';
import DaySelector from './DaySelector';
import DraggableHabitList from './DraggableHabitList';
import HabitForm from './HabitForm';

interface ConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (habits: HabitDetail[]) => void;
  onSaveAsTemplate: () => void;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onClose,
  onSave,
  onSaveAsTemplate,
  habits: initialHabits,
  activeDays,
  onUpdateDays,
}) => {
  const [habits, setHabits] = useState<HabitDetail[]>(initialHabits);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setHabits(initialHabits);
    } else {
      setDraggedIndex(null);
    }
  }, [open, initialHabits]);

  const handleAddHabit = () => {
    const newHabit: HabitDetail = {
      id: `habit-${Date.now()}`,
      name: 'New Habit',
      description: '',
      category: 'Personal',
      timePreference: 'Anytime',
      metrics: { type: 'boolean' },
      insights: [],
      tips: [],
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const handleUpdateHabit = (index: number, updates: Partial<HabitDetail>) => {
    setHabits(prevHabits => {
      const updatedHabits = [...prevHabits];
      updatedHabits[index] = {
        ...updatedHabits[index],
        ...updates,
      };
      return updatedHabits;
    });
  };

  const handleDeleteHabit = (index: number) => {
    setHabits(prevHabits => {
      const updatedHabits = [...prevHabits];
      updatedHabits.splice(index, 1);
      return updatedHabits;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setHabits(prevHabits => {
      const newHabits = [...prevHabits];
      const [draggedHabit] = newHabits.splice(draggedIndex, 1);
      newHabits.splice(index, 0, draggedHabit);
      setDraggedIndex(index);
      return newHabits;
    });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="configure-template-title"
    >
      <DialogTitle id="configure-template-title">Configure Template</DialogTitle>
      <DialogContent>
        <DaySelector activeDays={activeDays} onUpdateDays={onUpdateDays} />
        
        <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Configure Habits</Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddHabit}
          >
            Add Habit
          </Button>
        </Box>

        <Box>
          <DraggableHabitList
            habits={habits}
            draggedIndex={draggedIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onSaveAsTemplate}
        >
          Save as Custom Template
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onSave(habits)}
        >
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigurationDialog;
