
import React, { useEffect, useRef } from 'react';
import { TimerSection } from '@/components/timer/TimerSection';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { TimerErrorBoundary } from '@/components/timer/TimerErrorBoundary';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';
import { toast } from 'sonner';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = React.useState<Quote[]>([]);
  const habitCheckDoneRef = useRef(false);
  const tasksLoadedRef = useRef(false);
  
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
              
              // If there are still no tasks loaded after a second update, try to schedule them again
              if (tasks.length === 0) {
                console.log('Still no tasks loaded after update, triggering habits:processed event');
                eventBus.emit('habits:processed', {});
              }
            }, 100);
          } else {
            // Check if all habit tasks from localStorage are in memory
            const missingTasks = habitTasks.filter((storageTask: any) => 
              !tasks.some(memTask => memTask.id === storageTask.id)
            );
            
            if (missingTasks.length > 0) {
              console.log(`Found ${missingTasks.length} tasks in localStorage missing from memory`);
              // Add each task via task:create event
              missingTasks.forEach((task: any) => {
                console.log(`Adding missing task to memory: ${task.name} (${task.id})`);
                eventBus.emit('task:create', task);
              });
              
              setTimeout(() => {
                window.dispatchEvent(new Event('force-task-update'));
              }, 100);
              
              // Show notification if this is the first time loading tasks
              if (!tasksLoadedRef.current) {
                tasksLoadedRef.current = true;
                toast.info(`Loaded ${missingTasks.length} habit tasks`, {
                  description: "Your scheduled habit tasks have been synchronized."
                });
              }
            } else {
              console.log('All habit tasks are properly loaded');
              tasksLoadedRef.current = true;
            }
          }
        } else {
          // No habit tasks in localStorage, check if we need to trigger habit processing
          console.log('No habit tasks found in localStorage, checking if we need to reprocess habits');
          eventBus.emit('habits:processed', {});
        }
        
        // If we still need more iterations, schedule the next check
        if (iteration < 3) {
          setTimeout(() => checkHabits(iteration + 1), checkInterval * iteration);
        } else if (!tasksLoadedRef.current && tasks.length === 0) {
          // After all iterations, if still no tasks, try one more time with direct creation
          console.log('Final attempt to load habit tasks from templates');
          eventBus.emit('habits:reprocess-all', {});
        }
      };
      
      // Start the progressive checking after a short delay
      setTimeout(() => checkHabits(1), 300);
    }
  }, [tasks.length]);
  
  // Listen for force-task-update events
  useEffect(() => {
    const handleForceUpdate = () => {
      console.log('TimerPage: Received force-task-update event');
      // Check if we need to load any tasks that aren't in memory
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      const habitTasks = storedTasks.filter((task: any) => task.relationships?.habitId);
      
      if (habitTasks.length > 0 && habitTasks.length !== tasks.filter(t => t.relationships?.habitId).length) {
        console.log(`Mismatch between stored habit tasks (${habitTasks.length}) and memory tasks (${tasks.filter(t => t.relationships?.habitId).length})`);
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    return () => window.removeEventListener('force-task-update', handleForceUpdate);
  }, [tasks]);

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
