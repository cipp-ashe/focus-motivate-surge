import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DayOfWeek, SHORT_DAYS } from '@/types/habit';

// Define DAYS_OF_WEEK since it's not in habit.ts
const DAYS_OF_WEEK: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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

  // Get the array of day abbreviations from SHORT_DAYS
  const shortDayValues = Object.values(SHORT_DAYS);

  // Validate that all days are valid
  const normalizedDays = effectiveDays.filter((day): day is DayOfWeek =>
    shortDayValues.includes(SHORT_DAYS[day])
  );

  const handleDayToggle = (values: string[]) => {
    // Filter to ensure only valid DayOfWeek values
    const validDays = values.filter((day): day is DayOfWeek =>
      Object.keys(SHORT_DAYS).includes(day)
    ) as DayOfWeek[];

    effectiveHandler(validDays);
  };

  return (
    <ToggleGroup
      type="multiple"
      className="flex flex-wrap justify-center sm:justify-start gap-1.5"
      value={normalizedDays}
      onValueChange={handleDayToggle}
    >
      {Object.entries(SHORT_DAYS).map(([day, shortDay], index) => {
        const fullDay = DAYS_OF_WEEK[index];
        return (
          <ToggleGroupItem
            key={day}
            value={day as string}
            aria-label={`Toggle ${fullDay}`}
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
