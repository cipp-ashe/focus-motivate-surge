
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS_OF_WEEK, DayOfWeek, SHORT_DAYS } from '../types';

interface DaySelectorProps {
  activeDays: DayOfWeek[];
  onUpdateDays: (days: DayOfWeek[]) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  activeDays,
  onUpdateDays,
}) => {
  console.log('DaySelector render:', { activeDays }); // Debug log

  // Map short day names to full day names if needed
  const normalizedDays = activeDays.map(day => {
    // If it's a short day, make sure it's one of our valid short days
    if (SHORT_DAYS.includes(day as any)) {
      return day;
    }
    // If it's a full day, make sure it's one of our valid full days
    if (DAYS_OF_WEEK.includes(day as any)) {
      return day;
    }
    // Default to Monday if invalid
    return 'Mon';
  });

  const handleDayToggle = (values: string[]) => {
    console.log('Day toggle values:', values); // Debug log
    const validDays = values.filter((day): day is DayOfWeek => 
      DAYS_OF_WEEK.includes(day as any) || SHORT_DAYS.includes(day as any)
    );
    onUpdateDays(validDays);
  };

  return (
    <ToggleGroup 
      type="multiple"
      className="flex flex-wrap justify-center sm:justify-start gap-1.5"
      value={normalizedDays}
      onValueChange={handleDayToggle}
    >
      {DAYS_OF_WEEK.map((day, index) => {
        const shortDay = SHORT_DAYS[index];
        return (
          <ToggleGroupItem
            key={day}
            value={shortDay}
            aria-label={`Toggle ${day}`}
            className="flex-1 min-w-[40px] h-10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted transition-colors"
          >
            <span className="hidden sm:inline">{shortDay}</span>
            <span className="sm:hidden">{shortDay.charAt(0)}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};

export default DaySelector;
