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
    <div className="space-y-3">
      {habits.map((habit, index) => (
        <Card
          key={habit.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className={`p-4 transition-all duration-200 ${
            draggedIndex === index 
              ? 'ring-2 ring-primary shadow-lg scale-[1.02] opacity-90' 
              : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div 
              className="cursor-grab active:cursor-grabbing touch-none"
              onMouseDown={() => {}}
              onTouchStart={() => {}}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteHabit(index)}
              className="h-9 w-9"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-7 gap-4">
              <Input
                className="sm:col-span-3"
                placeholder="Habit name"
                value={habit.name}
                onChange={(e) => onUpdateHabit(index, { name: e.target.value })}
              />

              <Select
                value={habit.metrics.type}
                onValueChange={(value: 'boolean' | 'duration' | 'count' | 'rating') => {
                  onUpdateHabit(index, {
                    metrics: {
                      type: value,
                      ...(value === 'duration' && { unit: 'minutes', min: 5, target: 30 }),
                      ...(value === 'count' && { target: 1 }),
                      ...(value === 'rating' && { min: 1, max: 5 }),
                    },
                  });
                }}
              >
                <SelectTrigger className="sm:col-span-2">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boolean">Checkbox</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="count">Counter</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              {habit.metrics.type !== 'boolean' && (
                <Input
                  className="sm:col-span-2"
                  type="number"
                  placeholder="Target"
                  value={habit.metrics.target || ''}
                  onChange={(e) => onUpdateHabit(index, {
                    metrics: {
                      ...habit.metrics,
                      target: parseInt(e.target.value),
                    },
                  })}
                  min={habit.metrics.type === 'duration' ? 5 : 1}
                  max={habit.metrics.type === 'rating' ? 5 : undefined}
                />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DraggableHabitList;
