
import React from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import HabitTracker from '@/components/habits/HabitTracker';

const HabitsPage = () => {
  const { templates } = useHabitState();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Habit Configuration</h1>
      <HabitTracker activeTemplates={templates} />
    </div>
  );
};

export default HabitsPage;
