
import React from 'react';
import { HabitDetail, MetricType } from '../types';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, Trash2 } from "lucide-react";
import { MinutesInput } from "@/components/minutes/MinutesInput";

interface HabitFormFieldProps {
  habit: HabitDetail;
  onUpdate: (updates: Partial<HabitDetail>) => void;
  onDelete: () => void;
  isDraggable?: boolean;
  onDragStart?: () => void;
}

const HabitFormField: React.FC<HabitFormFieldProps> = ({
  habit,
  onUpdate,
  onDelete,
  isDraggable = false,
  onDragStart,
}) => {
  const handleMetricTypeChange = (value: MetricType) => {
    const updates: Partial<HabitDetail> = {
      metrics: {
        type: value,
        ...(value === 'timer' && { 
          unit: 'seconds',
          target: 1500,
          min: 60,
        }),
        ...(value === 'count' && { target: 1 }),
        ...(value === 'rating' && { min: 1, max: 5 }),
      },
    };
    onUpdate(updates);
  };

  const handleMinutesChange = (minutes: number) => {
    onUpdate({
      metrics: {
        ...habit.metrics,
        target: minutes * 60,
      },
    });
  };

  return (
    <Card className="p-3">
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          {isDraggable && (
            <div
              className="cursor-grab touch-none"
              onMouseDown={onDragStart}
              onTouchStart={onDragStart}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
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
            onValueChange={handleMetricTypeChange}
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
              <MinutesInput
                minutes={Math.round((habit.metrics.target || 1500) / 60)}
                onMinutesChange={handleMinutesChange}
                minMinutes={1}
                maxMinutes={60}
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

export default HabitFormField;
