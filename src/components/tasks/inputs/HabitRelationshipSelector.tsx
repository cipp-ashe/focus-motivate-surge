
import React from 'react';
import { Zap } from "lucide-react";
import { Task } from '@/types/tasks';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HabitRelationshipSelectorProps {
  habitId: string | null;
  onHabitSelect: (habitId: string | null) => void;
  habitTasks: Task[];
}

export const HabitRelationshipSelector: React.FC<HabitRelationshipSelectorProps> = ({
  habitId,
  onHabitSelect,
  habitTasks
}) => {
  return (
    <Select 
      onValueChange={(value) => onHabitSelect(value === 'none' ? null : value)} 
      defaultValue={habitId || 'none'}
    >
      <SelectTrigger 
        className="w-[180px] bg-background/50 border-input/50"
      >
        <SelectValue placeholder="Link to habit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="flex items-center gap-2">
          <span>No linked habit</span>
        </SelectItem>
        {habitTasks.map(habit => (
          <SelectItem key={habit.id} value={habit.id} className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-green-400" />
            <span>{habit.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
