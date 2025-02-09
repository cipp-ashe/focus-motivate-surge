
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS_OF_WEEK, DayOfWeek } from '../types';

interface DaySelectorProps {
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  activeDays,
  onUpdateDays,
}) => {
  return (
    <ToggleGroup 
      type="multiple"
      value={activeDays}
      onValueChange={(values) => {
        // Ensure we have at least one day selected
        if (values.length > 0) {
          onUpdateDays(values as DayOfWeek[]);
        }
      }}
      className="flex flex-wrap gap-1"
    >
      {DAYS_OF_WEEK.map((day) => (
        <ToggleGroupItem
          key={day}
          value={day}
          aria-label={`Toggle ${day}`}
          className="flex-1 min-w-[36px] h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {day.charAt(0)}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default DaySelector;
