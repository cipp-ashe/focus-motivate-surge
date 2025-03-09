
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
    
    // Progressive checks for habit tasks to ensure they're loaded
    const checkForPendingHabits = (iteration = 1) => {
      console.log(`Checking for pending habits from TimerPage (iteration ${iteration})`);
      
      // Check for pending habits
      eventBus.emit('habits:check-pending', {});
      
      // Force a task update to ensure any new tasks are loaded
      window.dispatchEvent(new Event('force-task-update'));
      
      // For really stubborn cases, directly check localStorage
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const habitTasks = storedTasks.filter((task: any) => task.relationships?.habitId);
      
      if (habitTasks.length > 0 && tasks.length === 0) {
        console.log(`Found ${habitTasks.length} habit tasks in localStorage but none loaded in memory`);
        
        // Force another task update with delay
        setTimeout(() => {
          window.dispatchEvent(new Event('force-task-update'));
        }, 300);
      }
    };
    
    // Perform multiple checks with increasing delays to catch all cases
    const timeouts = [
      setTimeout(() => checkForPendingHabits(1), 300),
      setTimeout(() => checkForPendingHabits(2), 800),
      setTimeout(() => checkForPendingHabits(3), 1500)
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [tasks.length]);

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
