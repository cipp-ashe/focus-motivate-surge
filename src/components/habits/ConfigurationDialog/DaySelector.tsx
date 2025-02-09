
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
  const handleDayToggle = (values: string[]) => {
    if (values.length > 0) {
      onUpdateDays(values as DayOfWeek[]);
    }
  };

  return (
    <ToggleGroup 
      type="multiple"
      value={activeDays}
      onValueChange={handleDayToggle}
      className="flex flex-wrap justify-center sm:justify-start gap-1.5"
    >
      {DAYS_OF_WEEK.map((day) => (
        <ToggleGroupItem
          key={day}
          value={day}
          aria-label={`Toggle ${day}`}
          className="flex-1 min-w-[40px] h-10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted transition-colors"
        >
          <span className="hidden sm:inline">{day.slice(0, 3)}</span>
          <span className="sm:hidden">{day.charAt(0)}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default DaySelector;
