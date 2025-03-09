
import React, { useEffect, useState } from 'react';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { AppLayout } from '@/components/AppLayout';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Force a task update when the page first loads
  useEffect(() => {
    if (!pageLoaded) {
      console.log("TimerPage: Initial load, forcing task and tag updates");
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        window.dispatchEvent(new Event('force-tags-update'));
        
        // Also check if any habit tasks need to be scheduled
        eventBus.emit('habits:check-pending', {});
        
        setPageLoaded(true);
      }, 100);
    }
  }, [pageLoaded]);

  // Force a task update when returning to this page
  useEffect(() => {
    console.log("TimerPage: Component mounted");
    
    // Delay to ensure navigation is complete
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
      window.dispatchEvent(new Event('force-tags-update'));
    }, 100);
    
    // Set up event listener for popstate (browser back/forward)
    const handlePopState = () => {
      console.log("TimerPage: Navigation occurred, updating tasks");
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        window.dispatchEvent(new Event('force-tags-update'));
      }, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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
        {/* Timer and Task components */}
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
    </div>
  );
};

export default TimerPage;
