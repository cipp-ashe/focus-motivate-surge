import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HabitDetail, DayOfWeek } from '@/types/habits/types';
import { DaySelector } from '@/components/habits/DaySelector';

interface CreateTemplateFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
    habits: HabitDetail[];
    defaultDays: DayOfWeek[];
    category: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    description: string;
    habits: HabitDetail[];
    defaultDays?: DayOfWeek[];
    category?: string;
  };
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [habits, setHabits] = useState<HabitDetail[]>(initialData?.habits || []);
  const [activeDays, setActiveDays] = useState<DayOfWeek[]>(
    initialData?.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  );
  const [category, setCategory] = useState(initialData?.category || 'Custom');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      habits,
      defaultDays: activeDays,
      category
    });
  };

  return (
    <Card className="p-4 border rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Custom Template"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this template helps with..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g., Wellness, Work)"
          />
        </div>

        <div className="space-y-2">
          <Label>Active Days</Label>
          <DaySelector
            selectedDays={activeDays}
            onChange={setActiveDays}
          />
        </div>

        <div className="pt-2 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!name}>
            Save Template
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateTemplateForm;
