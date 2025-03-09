
import React, { useEffect } from 'react';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { TimerErrorBoundary } from '@/components/timer/TimerErrorBoundary';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = React.useState<Quote[]>([]);
  
  // Track when TimerPage is mounted and ready
  useEffect(() => {
    console.log("TimerPage mounted and ready");
    
    // Notify that the timer page is ready
    eventBus.emit('page:timer-ready', {
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleTaskComplete = (metrics: any) => {
    if (selectedTask) {
      console.log("Task completed:", selectedTask.name, metrics);
    }
  };

  const handleDurationChange = (seconds: number) => {
    if (selectedTask) {
      console.log("Duration changed for task:", selectedTask.name, seconds);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <TimerErrorBoundary>
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
        </TimerErrorBoundary>
      </div>
    </div>
  );
};

export default TimerPage;
