
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
            onValueChange={(value: 'boolean' | 'duration' | 'count' | 'rating') => {
              onUpdate({
                metrics: {
                  type: value,
                  ...(value === 'duration' && { unit: 'minutes', min: 5, target: 30 }),
                  ...(value === 'count' && { target: 1 }),
                  ...(value === 'rating' && { min: 1, max: 5 }),
                },
                duration: value === 'duration' ? 30 : undefined, // Set duration directly when type is duration
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tracking type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="boolean">Checkbox</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="count">Counter</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>

          {habit.metrics.type === 'duration' && (
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Target minutes"
                value={habit.metrics.target || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  onUpdate({
                    metrics: {
                      ...habit.metrics,
                      target: value,
                    },
                    duration: value, // Update both metrics target and duration
                  });
                }}
                min={5}
              />
              <p className="text-xs text-muted-foreground">
                This duration will be used when sending to timer
              </p>
            </div>
          )}

          {habit.metrics.type !== 'boolean' && habit.metrics.type !== 'duration' && (
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
