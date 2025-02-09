
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DAYS_OF_WEEK } from './types';
import { cn } from "@/lib/utils";

interface ConfigurationDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (habits: HabitDetail[]) => void;
  onSaveAsTemplate: () => void;
  habits: HabitDetail[];
  activeDays?: DayOfWeek[];
  onUpdateDays?: (days: DayOfWeek[]) => void;
}

const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({
  open,
  onClose,
  onSave,
  onSaveAsTemplate,
  habits: initialHabits,
  activeDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  onUpdateDays = () => {},
}) => {
  const [habits, setHabits] = useState(initialHabits);
  const [currentDays, setCurrentDays] = useState(activeDays);
  
  const handleAddHabit = () => {
    const newHabit = {
      id: `habit-${Date.now()}`,
      name: 'New Habit',
      description: '',
      category: 'Personal',
      timePreference: 'Anytime',
      metrics: { type: 'boolean' },
      insights: [],
      tips: [],
    };
    setHabits([...habits, newHabit]);
  };

  const handleUpdateHabit = (index: number, updates: Partial<HabitDetail>) => {
    const updatedHabits = [...habits];
    updatedHabits[index] = { ...updatedHabits[index], ...updates };
    setHabits(updatedHabits);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHabits(items);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    if (updatedDays.length > 0) {
      setCurrentDays(updatedDays);
      onUpdateDays(updatedDays);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Configure Template</DialogTitle>
      </DialogHeader>
      <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Active Days</h4>
          <div className="flex gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <Button
                key={day}
                variant={currentDays.includes(day) ? "default" : "outline"}
                size="sm"
                onClick={() => handleDayToggle(day)}
                className="w-10 h-8 p-0"
              >
                {day[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-3">Configure Habits</h4>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="habits">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {habits.map((habit, index) => (
                    <Draggable key={habit.id} draggableId={habit.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-secondary/50 p-4 rounded-lg"
                        >
                          <div className="flex gap-4">
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <Input
                                placeholder="Habit Name"
                                value={habit.name}
                                onChange={(e) => handleUpdateHabit(index, { name: e.target.value })}
                              />
                              <Select
                                value={habit.metrics.type}
                                onValueChange={(value: 'boolean' | 'duration' | 'count' | 'rating') => {
                                  handleUpdateHabit(index, {
                                    metrics: {
                                      type: value,
                                      ...(value === 'duration' && { unit: 'minutes', min: 5, target: 30 }),
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
                                  <SelectItem value="duration">Duration</SelectItem>
                                  <SelectItem value="count">Counter</SelectItem>
                                  <SelectItem value="rating">Rating</SelectItem>
                                </SelectContent>
                              </Select>
                              {habit.metrics.type !== 'boolean' && (
                                <Input
                                  type="number"
                                  placeholder="Target Value"
                                  value={habit.metrics.target || ''}
                                  onChange={(e) => handleUpdateHabit(index, {
                                    metrics: {
                                      ...habit.metrics,
                                      target: parseInt(e.target.value),
                                    },
                                  })}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </ScrollArea>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={handleAddHabit}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </DialogContent>
      <DialogFooter className="flex justify-between items-center">
        <Button variant="outline" onClick={onSaveAsTemplate}>
          Save as Custom Template
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(habits)}>
            Apply Changes
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfigurationDialog;
