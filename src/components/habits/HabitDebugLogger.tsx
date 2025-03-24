
import React from 'react';
import { ActiveTemplate, HabitDetail } from '@/types/habits/types';

interface HabitDebugLoggerProps {
  templates?: ActiveTemplate[];
  todaysHabits?: HabitDetail[];
}

export const HabitDebugLogger: React.FC<HabitDebugLoggerProps> = ({ 
  templates = [], 
  todaysHabits = [] 
}) => {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="hidden">
      {/* Hidden debug information for development */}
      <div data-testid="habit-debug-templates">
        {JSON.stringify(templates)}
      </div>
      <div data-testid="habit-debug-habits">
        {JSON.stringify(todaysHabits)}
      </div>
    </div>
  );
};
