
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { GripVertical, Trash2 } from "lucide-react";
import { HabitDetail } from '../types';

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
    <div className="space-y-2">
      {habits.map((habit, index) => (
        <Card
          key={habit.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className={`p-2 transition-all duration-200 ${
            draggedIndex === index 
              ? 'ring-2 ring-primary shadow-lg scale-[1.02] opacity-90' 
              : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="cursor-grab active:cursor-grabbing touch-none">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            <Input
              className="flex-[2]"
              placeholder="Habit name"
              value={habit.name}
              onChange={(e) => onUpdateHabit(index, { name: e.target.value })}
            />

            <Select
              value={habit.metrics.type}
              onValueChange={(value: 'boolean' | 'timer' | 'note' | 'count' | 'rating') => {
                onUpdateHabit(index, {
                  metrics: {
                    type: value,
                    ...(value === 'timer' && { unit: 'minutes', min: 5, target: 1500 }),
                    ...(value === 'count' && { target: 1 }),
                    ...(value === 'rating' && { min: 1, max: 5 }),
                  },
                });
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boolean">Checkbox</SelectItem>
                <SelectItem value="timer">Timer</SelectItem>
                <SelectItem value="count">Counter</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>

            {habit.metrics.type !== 'boolean' && (
              <Input
                className="w-[80px]"
                type="number"
                placeholder="Target"
                value={habit.metrics.type === 'timer' ? 
                  Math.round((habit.metrics.target || 1500) / 60) : 
                  habit.metrics.target || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    onUpdateHabit(index, {
                      metrics: {
                        ...habit.metrics,
                        target: habit.metrics.type === 'timer' ? value * 60 : value,
                      },
                    });
                  }
                }}
                min={habit.metrics.type === 'timer' ? 5 : 1}
                max={habit.metrics.type === 'rating' ? 5 : undefined}
              />
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteHabit(index)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DraggableHabitList;
