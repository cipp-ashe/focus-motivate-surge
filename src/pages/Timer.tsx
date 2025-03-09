
import React, { useEffect, useRef, useState } from 'react';
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
  const initCompletedRef = useRef(false);
  const [forceUpdateCount, setForceUpdateCount] = useState(0);
  const updateTriggeredTimeRef = useRef(0);
  
  // Track when TimerPage is mounted and ready - only run once
  useEffect(() => {
    if (initCompletedRef.current) return;
    initCompletedRef.current = true;
    
    console.log("TimerPage mounted and ready");
    
    // Notify that the timer page is ready
    eventBus.emit('page:timer-ready', {
      timestamp: new Date().toISOString()
    });
    
    // Only do the initial habit task check once
    if (!habitCheckDoneRef.current) {
      habitCheckDoneRef.current = true;
      
      // Simpler, single check for habit tasks to avoid loops
      setTimeout(() => {
        console.log(`Checking for pending habits from TimerPage (one-time check)`);
        
        // Check for pending habits
        eventBus.emit('habits:check-pending', {});
        
        // Force a task update to ensure any new tasks are loaded
        const now = Date.now();
        updateTriggeredTimeRef.current = now;
        setForceUpdateCount(prev => prev + 1);
        
        // For really stubborn cases, directly check localStorage
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const habitTasks = storedTasks.filter((task: any) => task.relationships?.habitId);
        
        if (habitTasks.length > 0) {
          console.log(`Found ${habitTasks.length} habit tasks in localStorage`);
          
          if (tasks.length === 0) {
            console.log(`No tasks loaded in memory yet, forcing update`);
            // Force another task update with delay
            setTimeout(() => {
              const now = Date.now();
              if (now - updateTriggeredTimeRef.current > 500) {
                updateTriggeredTimeRef.current = now;
                window.dispatchEvent(new Event('force-task-update'));
              }
              
              // If there are still no tasks loaded after a second update, try to schedule them again
              if (tasks.length === 0) {
                console.log('Still no tasks loaded after update, triggering habits:processed event');
                eventBus.emit('habits:processed', {});
              }
            }, 300);
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
      }, 300);
    }
  }, [tasks.length]);
  
  // Listen for force-task-update events with debouncing
  useEffect(() => {
    const lastUpdateTime = useRef(0);
    
    const handleForceUpdate = () => {
      const now = Date.now();
      // Limit updates to no more than once every 800ms to avoid infinite loops
      if (now - lastUpdateTime.current > 800) {
        console.log('TimerPage: Received force-task-update event (debounced)');
        lastUpdateTime.current = now;
        // Use state update to trigger a controlled re-render
        setForceUpdateCount(prev => prev + 1);
      } else {
        console.log('TimerPage: Skipping too frequent force-task-update');
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, []);
  
  // This gives us a render key that changes on each force update
  // but doesn't cause a completely new component tree to be created
  const renderKey = `timer-page-${forceUpdateCount % 3}`;

  return (
    <HabitsPanelProvider>
      <TimerErrorBoundary>
        <TaskLayout
          key={renderKey}
          main={<TimerSection
            selectedTask={selectedTask}
            onTaskComplete={(metrics) => {
              eventBus.emit('task:complete', { taskId: selectedTaskId, metrics });
            }}
            onDurationChange={(seconds) => {
              if (selectedTaskId) {
                eventBus.emit('task:update', {
                  taskId: selectedTaskId,
                  updates: { duration: seconds }
                });
              }
            }}
            favorites={favorites}
            setFavorites={setFavorites}
          />}
          aside={<TaskManager />}
        />
      </TimerErrorBoundary>
    </HabitsPanelProvider>
  );
};

export default TimerPage;
