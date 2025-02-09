
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@mui/material';
import { HabitDetail, DayOfWeek } from '../../types';
import DialogHeader from './DialogHeader';
import DialogContent as CustomDialogContent from './DialogContent';
import DialogFooter from './DialogFooter';

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
      <DialogHeader />
      <DialogContent>
        <CustomDialogContent
          habits={habits}
          draggedIndex={draggedIndex}
          activeDays={activeDays}
          onUpdateDays={onUpdateDays}
          onAddHabit={handleAddHabit}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onUpdateHabit={handleUpdateHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      </DialogContent>
      <DialogFooter
        onSaveAsTemplate={onSaveAsTemplate}
        onClose={onClose}
        onSave={() => onSave(habits)}
      />
    </Dialog>
  );
};

export default ConfigurationDialog;
