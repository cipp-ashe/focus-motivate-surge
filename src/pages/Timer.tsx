
import React, { useEffect, useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import TaskManager from '@/components/tasks/TaskManager';
import { TaskLayout } from '@/components/tasks/TaskLayout';
import { Quote } from "@/types/timer";
import { eventBus } from '@/lib/eventBus';
import { TimerErrorBoundary } from '@/components/timer/TimerErrorBoundary';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';
import { toast } from '@/hooks/use-toast';
import { TimerSection } from '@/components/timer/TimerSection';
import { useEvent } from '@/hooks/useEvent';
import { Task } from '@/types/tasks';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    tasks.find(task => task.id === selectedTaskId) || null
  );
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [habitCheckDone, setHabitCheckDone] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Update selected task when the context changes
  useEffect(() => {
    const task = tasks.find(task => task.id === selectedTaskId);
    if (task) {
      console.log("TimerPage: Selected task from context:", task);
      setSelectedTask(task);
    }
  }, [tasks, selectedTaskId]);
  
  // Listen for task:select events directly
  useEvent('task:select', (taskId: string) => {
    console.log("TimerPage: Received task:select event for", taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  });
  
  // Listen for timer:set-task events 
  useEvent('timer:set-task', (task: Task) => {
    console.log("TimerPage: Received timer:set-task event", task);
    setSelectedTask(task);
  });
  
  // Track when TimerPage is mounted and ready
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
          
          toast.success(`Found ${habitTasks.length} habit tasks`, {
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
          asideContent={<TaskManager key={`task-manager-${forceUpdate}`} isTimerView />}
          mainContent={
            <TimerSection
              key={`timer-section-${selectedTask?.id || 'none'}-${forceUpdate}`}
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
