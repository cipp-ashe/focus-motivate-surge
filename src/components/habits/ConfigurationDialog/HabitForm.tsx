
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
  const displayMinutes = habit.metrics.type === 'timer' ? 
    Math.round(Number(habit.metrics.target || 0) / 60) : 
    habit.metrics.target || '';

  return (
    <Card className="p-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div
            className="cursor-grab touch-none"
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <Input
            placeholder="Habit name"
            value={habit.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="flex-1"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={habit.metrics.type}
            onValueChange={(value: 'boolean' | 'timer' | 'note' | 'count' | 'rating') => {
              onUpdate({
                metrics: {
                  type: value,
                  ...(value === 'timer' && { 
                    unit: 'seconds', 
                    target: 1500, // 25 minutes default
                    min: 60,
                  }),
                  ...(value === 'count' && { target: 1 }),
                  ...(value === 'rating' && { min: 1, max: 5 }),
                },
              });
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Checkbox</SelectItem>
              <SelectItem value="timer">Timer</SelectItem>
              <SelectItem value="count">Counter</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {habit.metrics.type === 'timer' && (
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Minutes"
                value={displayMinutes}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    const minutes = parseInt(value || '0');
                    if (!isNaN(minutes)) {
                      onUpdate({
                        metrics: {
                          ...habit.metrics,
                          target: minutes * 60,
                        },
                      });
                    }
                  }
                }}
                min={1}
                max={60}
                className="w-full"
              />
            </div>
          )}

          {habit.metrics.type !== 'boolean' && habit.metrics.type !== 'timer' && (
            <Input
              type="number"
              placeholder="Target"
              value={habit.metrics.target || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value)) {
                  onUpdate({
                    metrics: {
                      ...habit.metrics,
                      target: value,
                    },
                  });
                }
              }}
              min={habit.metrics.type === 'rating' ? 1 : undefined}
              max={habit.metrics.type === 'rating' ? 5 : undefined}
              className="flex-1"
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default HabitForm;
