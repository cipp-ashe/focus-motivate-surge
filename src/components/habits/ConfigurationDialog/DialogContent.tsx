import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DraggableHabitList from './DraggableHabitList';
import DayToggle from './DayToggle';
import { ActiveTemplate, DayOfWeek } from '@/types/habit';
import { DayToggleProps } from '@/types/habitComponents';

interface DialogContentProps {
  template: ActiveTemplate;
  onTemplateUpdate: (template: ActiveTemplate) => void;
  onClose: () => void;
}

const DialogContent: React.FC<DialogContentProps> = ({ template, onTemplateUpdate, onClose }) => {
  const [name, setName] = React.useState(template.name);
  const [description, setDescription] = React.useState(template.description || '');
  const [habits, setHabits] = React.useState(template.habits);
  const [activeDays, setActiveDays] = React.useState<DayOfWeek[]>(template.activeDays);
  
  // Update template name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  // Update template description
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  // Add a new habit to the template
  const handleAddHabit = () => {
    const newHabit = {
      id: uuidv4(),
      name: 'New Habit',
      description: 'Description',
      category: 'Personal',
      timePreference: 'Anytime',
      metrics: {
        type: 'boolean'
      }
    };
    setHabits([...habits, newHabit]);
  };
  
  // Remove a habit from the template
  const handleRemoveHabit = (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
  };
  
  // Update habit order
  const handleHabitOrderChange = (newHabits: any[]) => {
    setHabits(newHabits);
  };
  
  // Update active days
  const handleActiveDaysChange = (days: DayOfWeek[]) => {
    setActiveDays(days);
  };
  
  // Save the template
  const handleSave = () => {
    const updatedTemplate = {
      ...template,
      name,
      description,
      habits,
      activeDays
    };
    onTemplateUpdate(updatedTemplate);
    onClose();
  };
  
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div className="grid gap-2">
        <Label>Active Days</Label>
        <DayToggle
          days={activeDays}
          onChange={handleActiveDaysChange}
        />
      </div>
      <div className="grid gap-2">
        <Label>Habits</Label>
        <Card>
          <CardHeader>
            <CardTitle>Habits in this template</CardTitle>
            <CardDescription>Drag and drop to reorder</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <DraggableHabitList
                habits={habits}
                onHabitOrderChange={handleHabitOrderChange}
                onRemoveHabit={handleRemoveHabit}
              />
            </ScrollArea>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={handleAddHabit}>
          <Plus className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default DialogContent;
