
import React, { useState } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { useTodaysHabits, useHabitCompletion, useHabitProgress, useHabitEvents } from '@/hooks/habits';
import { TodaysHabitsSection, HabitTemplateManager, HabitDebugLogger } from '@/components/habits';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(templates);
  const { completedHabits, handleHabitComplete } = useHabitCompletion(todaysHabits, templates);
  useHabitEvents();

  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="space-y-6">
      <TodaysHabitsSection
        todaysHabits={todaysHabits}
        completedHabits={completedHabits}
        onHabitComplete={handleHabitComplete}
      />
      <HabitTemplateManager activeTemplates={templates} />

      {debugMode && (
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      )}
    </div>
  );
};

export default HabitTracker;
