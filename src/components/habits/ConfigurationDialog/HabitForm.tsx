
import React from 'react';
import { Label } from "@/components/ui/label";
import { HabitDetail, MetricType } from '../types';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HabitFormProps {
  habit: HabitDetail;
  onUpdate: (updates: Partial<HabitDetail>) => void;
  index?: number;
  onDeleteHabit?: (index: number) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  onUpdate,
  index,
  onDeleteHabit,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof HabitDetail) => {
    onUpdate({ [field]: e.target.value });
  };

  const handleMetricsChange = (value: string) => {
    // Ensure the value is a valid MetricType before setting it
    const metricType = value as MetricType;
    onUpdate({ metrics: { ...habit.metrics, type: metricType } });
  };

  return (
    <div className="grid gap-2">
      <div>
        <Label htmlFor={`habit-name-${index ?? 0}`}>Name</Label>
        <Input
          type="text"
          id={`habit-name-${index ?? 0}`}
          value={habit.name}
          onChange={(e) => handleInputChange(e, 'name')}
        />
      </div>
      <div>
        <Label htmlFor={`habit-description-${index ?? 0}`}>Description</Label>
        <Textarea
          id={`habit-description-${index ?? 0}`}
          value={habit.description || ''}
          onChange={(e) => handleInputChange(e, 'description')}
        />
      </div>
      <div>
        <Label htmlFor={`habit-metrics-${index ?? 0}`}>Metrics Type</Label>
        <Select onValueChange={handleMetricsChange} defaultValue={habit.metrics?.type}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a metric type" />
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
