
import React, { useState } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { useTodaysHabits, useHabitEvents } from '@/hooks/habits';
import { HabitTemplateManager, HabitDebugLogger } from '@/components/habits';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(templates);
  useHabitEvents();

  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="space-y-6">
      <HabitTemplateManager activeTemplates={templates} />

      {debugMode && (
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      )}
    </div>
  );
};

export default HabitTracker;
