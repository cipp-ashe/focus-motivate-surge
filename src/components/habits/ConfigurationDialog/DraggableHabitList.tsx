import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grip, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import HabitForm from "./HabitForm";
import { HabitDetail, MetricType } from '../types';

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
    <>
      {habits.map((habit, index) => (
        <Card
          key={habit.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className={cn(
            "border-border/50 dark:border-border/30 transition-shadow duration-200",
            draggedIndex === index ? "ring-2 ring-primary/50" : "hover:shadow-md"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Grip className="h-4 w-4 text-muted-foreground cursor-grab" />
              <span className="text-sm font-medium">{habit.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteHabit(index)}
              className="h-7 w-7 -mr-1 text-destructive/80 hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <HabitForm
            habit={habit}
            onUpdate={(updates) => onUpdateHabit(index, updates)}
          />
        </Card>
      ))}
    </>
  );
};

export default DraggableHabitList;
