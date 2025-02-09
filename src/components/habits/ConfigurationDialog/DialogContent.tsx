
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogContent as ShadcnDialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { HabitDetail, DayOfWeek } from '../types';
import DaySelector from './DaySelector';
import DraggableHabitList from './DraggableHabitList';
import DialogFooter from './DialogFooter';

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
  onSaveAsTemplate: () => void;
  onClose: () => void;
  onSave: () => void;
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
  onSaveAsTemplate,
  onClose,
  onSave,
}) => {
  return (
    <ShadcnDialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
      <div className="flex flex-col space-y-4 overflow-hidden">
        <div>
          <h3 className="text-lg font-medium mb-2">Active Days</h3>
          <DaySelector activeDays={activeDays} onUpdateDays={onUpdateDays} />
        </div>
        
        <div className="flex-1 min-h-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Habits</h3>
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

          <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
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

        <DialogFooter
          onSaveAsTemplate={onSaveAsTemplate}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </ShadcnDialogContent>
  );
};

export default DialogContent;
