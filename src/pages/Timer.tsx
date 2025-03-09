
import React, { useEffect, useRef } from 'react';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { TimerErrorBoundary } from '@/components/timer/TimerErrorBoundary';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = React.useState<Quote[]>([]);
  const habitCheckDoneRef = useRef(false);
  
  // Track when TimerPage is mounted and ready
  useEffect(() => {
    console.log("TimerPage mounted and ready");
    
    // Notify that the timer page is ready
    eventBus.emit('page:timer-ready', {
      timestamp: new Date().toISOString()
    });
    
    // Only do the initial habit task check once
    if (!habitCheckDoneRef.current) {
      habitCheckDoneRef.current = true;
      
      // Progressive checks for habit tasks to ensure they're loaded
      const checkInterval = 300; // milliseconds between checks
      
      const checkHabits = (iteration: number) => {
        console.log(`Checking for pending habits from TimerPage (iteration ${iteration})`);
        
        // Check for pending habits
        eventBus.emit('habits:check-pending', {});
        
        // Force a task update to ensure any new tasks are loaded
        window.dispatchEvent(new Event('force-task-update'));
        
        // For really stubborn cases, directly check localStorage
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const habitTasks = storedTasks.filter((task: any) => task.relationships?.habitId);
        
        if (habitTasks.length > 0) {
          console.log(`Found ${habitTasks.length} habit tasks in localStorage`);
          
          if (tasks.length === 0) {
            console.log(`No tasks loaded in memory yet, forcing update`);
            // Force another task update with delay
            setTimeout(() => {
              window.dispatchEvent(new Event('force-task-update'));
            }, 100);
          } else {
            // Check if all habit tasks from localStorage are in memory
            const missingTasks = habitTasks.filter((storageTask: any) => 
              !tasks.some(memTask => memTask.id === storageTask.id)
            );
            
            if (missingTasks.length > 0) {
              console.log(`Found ${missingTasks.length} tasks in localStorage missing from memory`);
              setTimeout(() => {
                window.dispatchEvent(new Event('force-task-update'));
              }, 100);
            }
          }
        }
        
        // If we still need more iterations, schedule the next check
        if (iteration < 3) {
          setTimeout(() => checkHabits(iteration + 1), checkInterval * iteration);
        }
      };
      
      // Start the progressive checking after a short delay
      setTimeout(() => checkHabits(1), 300);
    }
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

  // Ensure we're wrapping everything with the required context providers
  return (
    <HabitsPanelProvider>
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
    </HabitsPanelProvider>
  );
};

export default TimerPage;
