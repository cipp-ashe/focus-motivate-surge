import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { DAYS_OF_WEEK, DayOfWeek, NewTemplate, createEmptyHabit } from '../types';
import { toast } from 'sonner';
import HabitForm from '../ConfigurationDialog/HabitForm';

interface CreateTemplateFormProps {
  onSubmit: (template: NewTemplate) => void;
  onCancel: () => void;
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [habits, setHabits] = useState([createEmptyHabit()]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habits.some(habit => habit.name.trim())) {
      toast.error('Please configure at least one habit with a name');
      return;
    }

    onSubmit({
      name,
      description,
      category,
      defaultHabits: habits.filter(habit => habit.name.trim()),
      defaultDays: activeDays,
    });
  };

  const addHabit = () => {
    setHabits(prev => [...prev, createEmptyHabit()]);
  };

  const updateHabit = (index: number, updates: Partial<typeof habits[0]>) => {
    setHabits(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const removeHabit = (index: number) => {
    setHabits(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Active Days</Label>
        <ToggleGroup 
          type="multiple" 
          value={activeDays}
          onValueChange={(value) => setActiveDays(value as DayOfWeek[])}
          className="justify-start"
        >
          {DAYS_OF_WEEK.map((day) => (
            <ToggleGroupItem
              key={day}
              value={day}
              aria-label={`Toggle ${day}`}
              className="w-9 h-9"
            >
              {day}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Habits</Label>
          <Button type="button" variant="outline" size="sm" onClick={addHabit}>
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </Button>
        </div>

        <div className="space-y-3">
          {habits.map((habit, index) => (
            <HabitForm
              key={habit.id}
              habit={habit}
              onUpdate={(updates) => updateHabit(index, updates)}
              onDelete={() => removeHabit(index)}
              onDragStart={() => {}}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!name || !description || !category || activeDays.length === 0}
        >
          Create Template
        </Button>
      </div>
    </form>
  );
};

export default CreateTemplateForm;
