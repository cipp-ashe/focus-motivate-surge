
import React from 'react';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import TaskManager from '@/components/tasks/TaskManager';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskState } from '@/contexts/tasks/TaskContext';
import { eventBus } from '@/lib/eventBus';
import { TimerStateMetrics } from '@/types/metrics';
import { Quote } from '@/types/timer';
import { useState } from 'react';

const Index = () => {
  const { items, selected: selectedTaskId } = useTaskState();
  const [favorites, setFavorites] = useState<Quote[]>([]);

  const selectedTask = selectedTaskId 
    ? items.find(task => task.id === selectedTaskId)
    : null;

  const handleTaskComplete = (metrics: TimerStateMetrics) => {
    if (selectedTaskId) {
      eventBus.emit('task:complete', {
        taskId: selectedTaskId,
        metrics: {
          ...metrics,
          endTime: new Date(),
        }
      });
    }
  };

  const handleDurationChange = (seconds: number) => {
    if (selectedTaskId) {
      eventBus.emit('task:update', {
        taskId: selectedTaskId,
        updates: { duration: seconds }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col space-y-4">
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
    </div>
  );
};

export default Index;
