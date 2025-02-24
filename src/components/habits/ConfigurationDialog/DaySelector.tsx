
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
  console.log('DaySelector render:', { activeDays }); // Debug log

  const handleDayToggle = (values: string[]) => {
    console.log('Day toggle values:', values); // Debug log
    const validDays = values.filter((day): day is DayOfWeek => 
      DAYS_OF_WEEK.includes(day as DayOfWeek)
    );
    onUpdateDays(validDays);
  };

  return (
    <ToggleGroup 
      type="multiple"
      className="flex flex-wrap justify-center sm:justify-start gap-1.5"
      value={activeDays}
      onValueChange={handleDayToggle}
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
