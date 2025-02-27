
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HabitDetail, DayOfWeek } from '../types';
import DialogHeader from './DialogHeader';
import DialogFooter from './DialogFooter';
import DaySelector from './DaySelector';
import DraggableHabitList from './DraggableHabitList';

interface ConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
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
      console.log("ConfigurationDialog opened with habits:", initialHabits);
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

  if (!open) return null;

  console.log("Rendering ConfigurationDialog, open:", open);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="space-y-4 p-6 overflow-y-auto">
            <div>
              <h3 className="text-lg font-medium mb-2">Active Days</h3>
              <DaySelector activeDays={activeDays} onUpdateDays={onUpdateDays} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Habits</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddHabit}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Habit
                </Button>
              </div>

              <div className="overflow-y-auto max-h-[calc(80vh-300px)] pr-2">
                <DraggableHabitList
                  habits={habits}
                  draggedIndex={draggedIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onUpdateHabit={handleUpdateHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto border-t p-6">
            <DialogFooter
              onSaveAsTemplate={onSaveAsTemplate}
              onClose={onClose}
              onSave={onSave}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurationDialog;
