
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogContent as ShadcnDialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { HabitDetail, DayOfWeek } from '../types';
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
    <ShadcnDialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[80vh]">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Active Days</h3>
          <DaySelector activeDays={activeDays} onUpdateDays={onUpdateDays} />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Configure Habits</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddHabit}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Habit
            </Button>
          </div>

          <div className="space-y-4">
            <DraggableHabitList
              habits={habits}
              draggedIndex={draggedIndex}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onUpdateHabit={onUpdateHabit}
              onDeleteHabit={onDeleteHabit}
            />
          </div>
        </div>
      </div>
    </ShadcnDialogContent>
  );
};

export default DialogContent;
