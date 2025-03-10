
import React from 'react';
import { DatePickerSection } from './DatePickerSection';
import { HabitRelationshipSelector } from './HabitRelationshipSelector';
import { Task } from '@/types/tasks';

interface TaskSettingsRowProps {
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  habitId: string | null;
  onHabitSelect: (habitId: string | null) => void;
  habitTasks: Task[];
}

export const TaskSettingsRow: React.FC<TaskSettingsRowProps> = ({
  date,
  onDateSelect,
  habitId,
  onHabitSelect,
  habitTasks
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Date Picker Component */}
      <DatePickerSection 
        date={date} 
        onDateSelect={onDateSelect} 
      />
      
      {/* Habit Relationship Selector Component */}
      <HabitRelationshipSelector
        habitId={habitId}
        onHabitSelect={onHabitSelect}
        habitTasks={habitTasks}
      />
    </div>
  );
};
