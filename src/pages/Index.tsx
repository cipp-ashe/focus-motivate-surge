
import React from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import TaskManager from '@/components/tasks/TaskManager';
import HabitTracker from '@/components/habits/HabitTracker';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskState, useTaskActions } from '@/contexts/tasks/TaskContext';
import { TimerStateMetrics } from '@/types/metrics';
import { Quote } from '@/types/timer';
import { useState } from 'react';

const Index = () => {
  const { items, selected: selectedTaskId } = useTaskState();
  const actions = useTaskActions();
  const [favorites, setFavorites] = useState<Quote[]>([]);

  const selectedTask = selectedTaskId 
    ? items.find(task => task.id === selectedTaskId)
    : null;

  const handleTaskComplete = (metrics: TimerStateMetrics) => {
    if (selectedTaskId) {
      actions.completeTask(selectedTaskId, {
        ...metrics,
        endTime: new Date(),
      });
    }
  };

  const handleDurationChange = (seconds: number) => {
    if (selectedTaskId) {
      actions.updateTask(selectedTaskId, { duration: seconds });
    }
  };

  return (
    <div className="space-y-4">
      <TaskLayout
        timer={
          <TimerSection
            selectedTask={selectedTask}
            onTaskComplete={handleTaskComplete}
            onDurationChange={handleDurationChange}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        }
        taskList={<TaskManager />}
      />
      <HabitTracker />
    </div>
  );
};

export default Index;
