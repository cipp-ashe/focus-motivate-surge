import React from 'react';
import TaskManager from '@/components/tasks/TaskManager';
import HabitTracker from '@/components/habits/HabitTracker';

const Index = () => {
  return (
    <div>
      <TaskManager />
      <HabitTracker />
    </div>
  );
};

export default Index;
