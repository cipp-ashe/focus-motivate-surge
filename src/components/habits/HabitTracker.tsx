import React, { useState } from 'react';
import { useTodaysHabits, useHabitCompletion, useHabitProgress, useHabitEvents } from '@/hooks/habits';
import { TodaysHabitsSection, HabitTemplateManager, HabitDebugLogger } from '@/components/habits';
import { useHabitState } from '@/contexts/habits/HabitContext';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(templates);
  const { completeHabit } = useHabitCompletion();
  const { habitProgress } = useHabitProgress(templates);
  useHabitEvents();

  const [debugMode, setDebugMode] = useState(false);

  const handleHabitComplete = (habit, templateId) => {
    completeHabit(habit.id, templateId);
  };

  return (
    <div className="space-y-6">
      <TodaysHabitsSection
        habits={todaysHabits}
        completedHabits={habitProgress}
        onHabitComplete={handleHabitComplete}
      />
      <HabitTemplateManager />

      {debugMode && (
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      )}
    </div>
  );
};

export default HabitTracker;
