
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, Trash2 } from "lucide-react";
import { HabitDetail } from '../types';
import { MinutesInput } from "@/components/minutes/MinutesInput";
import { cn } from '@/lib/utils';

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
        <div
          key={habit.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDragEnd={onDragEnd}
          className={cn(
            "border rounded-md p-2 bg-card/50",
            "transition-all duration-200 hover:bg-card/90",
            draggedIndex === index ? 'ring-1 ring-primary shadow-md scale-[1.02] opacity-95' : ''
          )}
        >
          <div className="flex items-center gap-2">
            <div className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Input
                  placeholder="Habit name"
                  value={habit.name}
                  onChange={(e) => onUpdateHabit(index, { name: e.target.value })}
                  className="h-7 text-sm"
                />

                <Select
                  value={habit.metrics.type}
                  onValueChange={(value: 'boolean' | 'timer' | 'count' | 'rating') => {
                    onUpdateHabit(index, {
                      metrics: {
                        type: value,
                        ...(value === 'timer' && { unit: 'minutes', min: 5, target: 600 }),
                        ...(value === 'count' && { target: 1 }),
                        ...(value === 'rating' && { min: 1, max: 5 }),
                      },
                    });
                  }}
                >
                  <SelectTrigger className="w-[90px] h-7 text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Checkbox</SelectItem>
                    <SelectItem value="timer">Timer</SelectItem>
                    <SelectItem value="count">Counter</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteHabit(index)}
                  className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Description (optional)"
                  value={habit.description || ''}
                  onChange={(e) => onUpdateHabit(index, { description: e.target.value })}
                  className="flex-1 h-6 text-xs"
                />

                {habit.metrics.type === 'timer' && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Target:</span>
                    <MinutesInput
                      minutes={Math.round((habit.metrics.target || 600) / 60)}
                      onMinutesChange={(newMinutes) => {
                        onUpdateHabit(index, {
                          metrics: {
                            ...habit.metrics,
                            target: newMinutes * 60,
                          },
                        });
                      }}
                      minMinutes={5}
                      maxMinutes={60}
                    />
                  </div>
                )}

                {(habit.metrics.type === 'count' || habit.metrics.type === 'rating') && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Target:</span>
                    <Input
                      className="w-16 h-6 text-xs"
                      type="number"
                      placeholder="Target"
                      value={habit.metrics.target || ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          onUpdateHabit(index, {
                            metrics: {
                              ...habit.metrics,
                              target: value,
                            },
                          });
                        }
                      }}
                      min={habit.metrics.type === 'rating' ? 1 : undefined}
                      max={habit.metrics.type === 'rating' ? 5 : undefined}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {habits.length === 0 && (
        <div className="text-center p-4 text-sm text-muted-foreground border border-dashed rounded-md">
          No habits added yet. Click the "Add Habit" button to get started.
        </div>
      )}
    </div>
  );
};

export default DraggableHabitList;
