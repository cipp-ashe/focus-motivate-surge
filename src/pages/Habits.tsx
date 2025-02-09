
import React from 'react';
import HabitTracker from '@/components/habits/HabitTracker';

const HabitsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold text-primary mb-6">Habit Configuration</h1>
      <HabitTracker />
    </div>
  );
};

export default HabitsPage;
