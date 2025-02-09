
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2">
      <Label htmlFor="days">Active Days</Label>
      <ToggleGroup 
        type="multiple"
        value={activeDays}
        onValueChange={onUpdateDays}
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
  );
};

export default DaySelector;

