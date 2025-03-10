
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
  const initCompletedRef = useRef(false);
  const forceCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      
      // Simpler, single check for habit tasks
      if (forceCheckTimeoutRef.current) {
        clearTimeout(forceCheckTimeoutRef.current);
      }
      
      forceCheckTimeoutRef.current = setTimeout(() => {
        console.log(`Checking for pending habits from TimerPage (one-time check)`);
        
        // Check for pending habits
        eventBus.emit('habits:check-pending', {});
        
        // For really stubborn cases, directly check localStorage
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const habitTasks = storedTasks.filter((task: any) => task.relationships?.habitId);
        
        if (habitTasks.length > 0) {
          console.log(`Found ${habitTasks.length} habit tasks in localStorage`);
          
          // If there are tasks in localStorage that aren't in the app state
          if (tasks.length === 0 || habitTasks.some((storageTask: any) => 
              !tasks.some(memTask => memTask.id === storageTask.id))) {
            
            // Force a gentle task update
            window.dispatchEvent(new Event('force-task-update'));
            
            // Show notification
            toast.info(`Found ${habitTasks.length} scheduled tasks`, {
              description: "Loading your habit tasks..."
            });
          }
        } else {
          console.log('No habit tasks found in localStorage');
          // Signal that we've processed habits
          eventBus.emit('habits:processed', {});
        }
        
        forceCheckTimeoutRef.current = null;
      }, 500);
    }
    
    return () => {
      if (forceCheckTimeoutRef.current) {
        clearTimeout(forceCheckTimeoutRef.current);
        forceCheckTimeoutRef.current = null;
      }
    };
  }, [tasks.length]);
  
  // Listen for force-task-update events, but only once
  useEffect(() => {
    const handleForceUpdate = () => {
      console.log('TimerPage: Received force-task-update event');
      // This is now a no-op - we don't need to do anything here
      // since the TaskContext handles the actual updates
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, []);

  return (
    <HabitsPanelProvider>
      <TimerErrorBoundary>
        <TaskLayout
          mainContent={<TimerSection
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
          asideContent={<TaskManager />}
        />
      </TimerErrorBoundary>
    </HabitsPanelProvider>
  );
};

export default TimerPage;
