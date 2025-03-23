
import React from 'react';
import { DayOfWeek } from '@/components/habits/types';
import { Button } from '@/components/ui/button';

interface DaySelectorProps {
  selectedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  className?: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({ 
  selectedDays, 
  onChange,
  className = ''
}) => {
  const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const toggleDay = (day: DayOfWeek) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };
  
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {days.map(day => (
        <Button
          key={day}
          type="button"
          variant={selectedDays.includes(day) ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0 rounded-full"
          onClick={() => toggleDay(day)}
        >
          {day.charAt(0)}
        </Button>
      ))}
    </div>
  );
};

export default DaySelector;
