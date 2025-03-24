import React from 'react';
import { Label } from "@/components/ui/label";
import { HabitDetail } from '../types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HabitFormProps {
  index: number;
  habit: HabitDetail;
  onUpdateHabit: (index: number, updates: Partial<HabitDetail>) => void;
  onDeleteHabit: (index: number) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  index,
  habit,
  onUpdateHabit,
  onDeleteHabit,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof HabitDetail) => {
    onUpdateHabit(index, { [field]: e.target.value });
  };

  const handleMetricsChange = (value: string) => {
    onUpdateHabit(index, { metrics: { type: value } });
  };

  return (
    <div className="grid gap-2">
      <div>
        <Label htmlFor={`habit-name-${index}`}>Name</Label>
        <Input
          type="text"
          id={`habit-name-${index}`}
          value={habit.name}
          onChange={(e) => handleInputChange(e, 'name')}
        />
      </div>
      <div>
        <Label htmlFor={`habit-description-${index}`}>Description</Label>
        <Textarea
          id={`habit-description-${index}`}
          value={habit.description || ''}
          onChange={(e) => handleInputChange(e, 'description')}
        />
      </div>
      <div>
        <Label htmlFor={`habit-metrics-${index}`}>Metrics Type</Label>
        <Select onValueChange={handleMetricsChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a metric type" defaultValue={habit.metrics?.type} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="boolean">Boolean</SelectItem>
            <SelectItem value="timer">Timer</SelectItem>
            <SelectItem value="counter">Counter</SelectItem>
            <SelectItem value="journal">Journal</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default HabitForm;
