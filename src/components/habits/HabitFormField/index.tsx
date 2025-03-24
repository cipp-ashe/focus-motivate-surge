
import React, { useState } from 'react';
import { HabitDetail, MetricType } from '@/types/habits';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { MinutesInput } from "@/components/minutes/MinutesInput";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleMetricTypeChange = (value: MetricType) => {
    const updates: Partial<HabitDetail> = {
      metrics: {
        type: value,
        ...(value === 'timer' && { 
          unit: 'seconds',
          goal: 600, // Default 10 minutes
          min: 60,
        }),
        ...(value === 'counter' && { goal: 1 }),
        ...(value === 'rating' && { min: 1, max: 5 }),
      },
    };
    onUpdate(updates);
  };

  const handleMinutesChange = (minutes: number) => {
    const seconds = minutes * 60;
    onUpdate({
      metrics: {
        ...habit.metrics,
        goal: seconds,
      },
    });
  };

  const handleAddTip = () => {
    const tips = habit.tips || [];
    onUpdate({
      tips: [...tips, '']
    });
  };

  const handleUpdateTip = (index: number, value: string) => {
    const tips = [...(habit.tips || [])];
    tips[index] = value;
    onUpdate({ tips });
  };

  const handleRemoveTip = (index: number) => {
    const tips = [...(habit.tips || [])];
    tips.splice(index, 1);
    onUpdate({ tips });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
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

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <CollapsibleContent className="space-y-3">
            <Textarea
              placeholder="Description"
              value={habit.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="min-h-[80px] text-sm"
            />

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
                  <SelectItem value="counter">Counter</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                </SelectContent>
              </Select>

              {habit.metrics.type === 'timer' && (
                <div className="flex-1">
                  <MinutesInput
                    minutes={Math.round((habit.metrics.goal || 600) / 60)}
                    onMinutesChange={handleMinutesChange}
                    minMinutes={1}
                    maxMinutes={60}
                  />
                </div>
              )}

              {habit.metrics.type !== 'boolean' && habit.metrics.type !== 'timer' && habit.metrics.type !== 'journal' && (
                <Input
                  type="number"
                  placeholder="Target"
                  value={habit.metrics.goal || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      onUpdate({
                        metrics: {
                          ...habit.metrics,
                          goal: value,
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Tips &amp; Prompts</h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddTip}
                  className="h-7 gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">Add Tip</span>
                </Button>
              </div>
              
              <div className="space-y-2">
                {(habit.tips || []).map((tip, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tip}
                      onChange={(e) => handleUpdateTip(index, e.target.value)}
                      placeholder={`Tip #${index + 1}`}
                      className="flex-1 text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTip(index)}
                      className="h-8 w-8 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {(!habit.tips || habit.tips.length === 0) && (
                  <p className="text-xs text-muted-foreground p-2 text-center border border-dashed rounded-md">
                    No tips added yet. Tips will appear to users when using this habit.
                  </p>
                )}
              </div>
            </div>
          </CollapsibleContent>

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
                <SelectItem value="counter">Counter</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="journal">Journal</SelectItem>
              </SelectContent>
            </Select>

            {habit.metrics.type === 'timer' && (
              <div className="flex-1">
                <MinutesInput
                  minutes={Math.round((habit.metrics.goal || 600) / 60)}
                  onMinutesChange={handleMinutesChange}
                  minMinutes={1}
                  maxMinutes={60}
                />
              </div>
            )}

            {habit.metrics.type !== 'boolean' && habit.metrics.type !== 'timer' && habit.metrics.type !== 'journal' && (
              <Input
                type="number"
                placeholder="Target"
                value={habit.metrics.goal || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    onUpdate({
                      metrics: {
                        ...habit.metrics,
                        goal: value,
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
    </Collapsible>
  );
};

export default HabitFormField;
