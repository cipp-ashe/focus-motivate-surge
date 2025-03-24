
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS_OF_WEEK, SHORT_DAYS, DayOfWeek } from '@/types/habits/types';

interface DaySelectorProps {
  activeDays?: DayOfWeek[];
  onUpdateDays?: (days: DayOfWeek[]) => void;
  selectedDays?: DayOfWeek[];
  onChange?: (days: DayOfWeek[]) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  activeDays,
  onUpdateDays,
  selectedDays,
  onChange,
}) => {
  // Support both prop patterns for flexibility
  const effectiveDays = selectedDays || activeDays || [];
  const effectiveHandler = onChange || onUpdateDays || (() => {});

  // Validate that all days are valid
  const normalizedDays = effectiveDays.filter((day): day is DayOfWeek => 
    SHORT_DAYS.includes(day as any)
  );

  const handleDayToggle = (values: string[]) => {
    // Filter to ensure only valid DayOfWeek values
    const validDays = values.filter((day): day is DayOfWeek => 
      SHORT_DAYS.includes(day as any)
    );
    effectiveHandler(validDays);
  };

  return (
    <ToggleGroup 
      type="multiple"
      className="flex flex-wrap justify-center sm:justify-start gap-1.5"
      value={normalizedDays}
      onValueChange={handleDayToggle}
    >
      {SHORT_DAYS.map((day, index) => {
        const fullDay = DAYS_OF_WEEK[index];
        return (
          <ToggleGroupItem
            key={day}
            value={day}
            aria-label={`Toggle ${fullDay}`}
            className="flex-1 min-w-[40px] h-10 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-muted transition-colors"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};
