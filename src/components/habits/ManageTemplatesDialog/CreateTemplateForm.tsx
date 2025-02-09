
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { DAYS_OF_WEEK, DayOfWeek, NewTemplate, HabitDetail } from '../types';
import { Card } from "@/components/ui/card";
import { toast } from 'sonner';

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
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [habits, setHabits] = useState<HabitDetail[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (habits.length === 0) {
      toast.error('Please add at least one habit to the template');
      return;
    }

    onSubmit({
      name,
      description,
      category,
      defaultHabits: habits,
      defaultDays: activeDays,
    });
  };

  const addHabit = () => {
    const newHabit: HabitDetail = {
      id: `habit-${Date.now()}`,
      name: '',
      description: '',
      category: category,
      timePreference: 'Anytime',
      metrics: { type: 'boolean' },
      insights: [],
      tips: []
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (index: number, updates: Partial<HabitDetail>) => {
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
        <Label htmlFor="days">Active Days</Label>
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
              {day.charAt(0)}
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
            <Card key={habit.id} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Habit {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHabit(index)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Habit name"
                    value={habit.name}
                    onChange={(e) => updateHabit(index, { name: e.target.value })}
                    required
                  />
                  <Textarea
                    placeholder="Habit description"
                    value={habit.description}
                    onChange={(e) => updateHabit(index, { description: e.target.value })}
                    required
                  />
                </div>
              </div>
            </Card>
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

