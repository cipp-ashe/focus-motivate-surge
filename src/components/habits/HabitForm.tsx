
import React from 'react';
import { DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Habit } from '@/types/habits';

interface HabitFormProps {
  newHabit: Partial<Habit>;
  onHabitChange: (updates: Partial<Habit>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({
  newHabit,
  onHabitChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Habit</DialogTitle>
        <DialogDescription>
          Create a new habit to track. Fill in the details below.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Input
            placeholder="Habit Name"
            value={newHabit.name}
            onChange={(e) => onHabitChange({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Description"
            value={newHabit.description}
            onChange={(e) => onHabitChange({ description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select
              value={newHabit.category}
              onValueChange={(value) => onHabitChange({ category: value as Habit['category'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {['Wellness', 'Work', 'Personal', 'Learning'].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Select
              value={newHabit.timePreference}
              onValueChange={(value) => onHabitChange({ timePreference: value as Habit['timePreference'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Preferred Time" />
              </SelectTrigger>
              <SelectContent>
                {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={!newHabit.name || !newHabit.description}>
          Add Habit
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
