
import React from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Timer } from '@/components/tasks/Timer';
import TaskManager from '@/components/tasks/TaskManager';
import HabitTracker from '@/components/habits/HabitTracker';

const Index = () => {
  return (
    <div className="space-y-4">
      <TaskLayout
        timer={<Timer />}
        taskList={<TaskManager />}
      />
      <HabitTracker />
    </div>
  );
};

export default Index;
