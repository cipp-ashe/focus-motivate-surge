
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { HabitDetail } from '../types';

interface HabitFormProps {
  habit: HabitDetail;
  onUpdate: (updates: Partial<HabitDetail>) => void;
  onDelete: () => void;
  onDragStart?: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  onUpdate,
  onDelete,
  onDragStart,
}) => {
  // Convert seconds to minutes only for display in the input
  const displayMinutes = habit.metrics.type === 'timer' ? 
    Math.round(Number(habit.metrics.target || 0) / 60) : 
    habit.metrics.target || '';

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div
          className="cursor-grab touch-none"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex-1 space-y-4">
          <Input
            placeholder="Habit name"
            value={habit.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />

          <Select
            value={habit.metrics.type}
            onValueChange={(value: 'boolean' | 'timer' | 'note' | 'count' | 'rating') => {
              console.log('Changing habit type to:', value);
              onUpdate({
                metrics: {
                  type: value,
                  ...(value === 'timer' && { 
                    unit: 'seconds', 
                    target: 1500, // Default 25 minutes in seconds
                    min: 60, // Minimum 1 minute in seconds
                  }),
                  ...(value === 'count' && { target: 1 }),
                  ...(value === 'rating' && { min: 1, max: 5 }),
                },
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tracking type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Checkbox</SelectItem>
              <SelectItem value="timer">Timer</SelectItem>
              <SelectItem value="count">Counter</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {habit.metrics.type === 'timer' && (
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Duration in minutes"
                value={displayMinutes}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value);
                  if (!isNaN(minutes)) {
                    const seconds = minutes * 60;
                    console.log(`Setting timer duration: ${minutes} minutes (${seconds} seconds)`);
                    onUpdate({
                      metrics: {
                        ...habit.metrics,
                        target: seconds, // Store as seconds
                      },
                    });
                  }
                }}
                min={1}
                max={60}
              />
              <p className="text-xs text-muted-foreground">
                Enter duration in minutes (stored as seconds internally)
              </p>
            </div>
          )}

          {habit.metrics.type !== 'boolean' && habit.metrics.type !== 'timer' && (
            <Input
              type="number"
              placeholder="Target value"
              value={habit.metrics.target || ''}
              onChange={(e) => onUpdate({
                metrics: {
                  ...habit.metrics,
                  target: parseInt(e.target.value),
                },
              })}
              min={habit.metrics.type === 'rating' ? 1 : undefined}
              max={habit.metrics.type === 'rating' ? 5 : undefined}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default HabitForm;
