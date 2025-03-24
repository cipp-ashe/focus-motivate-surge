
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitDetail, DayOfWeek } from '@/types/habits/types';
import { DaySelector } from '../DaySelector';

interface NewTemplateFormProps {
  onCreateTemplate: (template: {
    name: string;
    description: string;
    habits: HabitDetail[];
    defaultDays: DayOfWeek[];
    category: string;
  }) => void;
}

export const NewTemplateForm: React.FC<NewTemplateFormProps> = ({ onCreateTemplate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [habits, setHabits] = useState<HabitDetail[]>([]);
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [category, setCategory] = useState('Custom');

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    onCreateTemplate({
      name,
      description,
      habits,
      defaultDays: activeDays,
      category
    });
    
    // Reset form
    setName('');
    setDescription('');
    setHabits([]);
    setActiveDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setCategory('Custom');
  };

  const addDefaultHabit = () => {
    const newHabit: HabitDetail = {
      id: `habit-${Date.now()}`,
      name: 'New Habit',
      description: '',
      category: 'Personal',
      timePreference: 'Anytime',
      metrics: { type: 'boolean' }
    };
    
    setHabits([...habits, newHabit]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="template-category">Category</Label>
          <Input
            id="template-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Active Days</Label>
          <DaySelector
            activeDays={activeDays}
            onUpdateDays={setActiveDays}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Habits</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addDefaultHabit}
              type="button"
            >
              Add Habit
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {habits.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">No habits added yet</p>
            ) : (
              habits.map((habit, index) => (
                <div key={habit.id} className="p-2 border rounded-md">
                  {habit.name}
                </div>
              ))
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full"
        >
          Create Template
        </Button>
      </CardContent>
    </Card>
  );
};
