
import React, { useEffect, useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { TimerErrorBoundary } from '@/components/timer/TimerErrorBoundary';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';
import { toast } from 'sonner';
import { TimerSection } from '@/components/timer/TimerSection';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null;
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [habitCheckDone, setHabitCheckDone] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Track when TimerPage is mounted and ready - only run once
  useEffect(() => {
    console.log("TimerPage mounted and ready");
    
    // Notify that the timer page is ready
    eventBus.emit('page:timer-ready', {
      timestamp: new Date().toISOString()
    });
    
    if (!habitCheckDone) {
      setHabitCheckDone(true);
      
      // Force UI update to ensure all tasks are loaded
      window.dispatchEvent(new Event('force-task-update'));
      
      // Check for pending habits
      setTimeout(() => {
        console.log(`Checking for pending habits from TimerPage (one-time check)`);
        eventBus.emit('habits:check-pending', {});
        
        // Check localStorage directly for habit tasks
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const habitTasks = storedTasks.filter((task) => task.relationships?.habitId);
        
        if (habitTasks.length > 0) {
          console.log(`Found ${habitTasks.length} habit tasks in localStorage`);
          
          // Force multiple updates to ensure tasks are loaded
          [200, 500, 1000].forEach(delay => {
            setTimeout(() => {
              window.dispatchEvent(new Event('force-task-update'));
              setForceUpdate(prev => prev + 1); // Trigger a re-render
            }, delay);
          });
          
          toast.info(`Found ${habitTasks.length} habit tasks`, {
            description: "Loading your scheduled tasks..."
          });
        } else {
          console.log('No habit tasks found in localStorage');
          // Signal that we've processed habits
          eventBus.emit('habits:processed', {});
        }
      }, 300);
    }
  }, [tasks, habitCheckDone]);

  // Display loading state if no tasks are loaded but localStorage has tasks
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    if (storedTasks.length > 0 && tasks.length === 0) {
      console.log("Tasks exist in storage but not loaded in state yet");
      // Force update to sync memory with storage
      window.dispatchEvent(new Event('force-task-update'));
      setForceUpdate(prev => prev + 1); // Trigger a re-render
    }
  }, [tasks]);

  // Listen for force-task-update events
  useEffect(() => {
    const handleForceUpdate = () => {
      setForceUpdate(prev => prev + 1); // Trigger a re-render
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
          asideContent={<TaskManager key={`task-manager-${forceUpdate}`} />}
          mainContent={
            <TimerSection
              key={`timer-section-${selectedTaskId}-${forceUpdate}`}
              selectedTask={selectedTask}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          }
        />
      </TimerErrorBoundary>
    </HabitsPanelProvider>
  );
};

export default TimerPage;
