
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
import { useTimerTasksManager } from '@/hooks/tasks/useTimerTasksManager';
import { useTimerDebug } from '@/hooks/useTimerDebug';

const TimerPage = () => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    tasks.find(task => task.id === selectedTaskId) || null
  );
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [habitCheckDone, setHabitCheckDone] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Enable debug mode
  useTimerDebug(true);
  
  // Get timer tasks manager functions
  const timerTasksManager = useTimerTasksManager();
  
  // Debug: Log initial state
  useEffect(() => {
    console.log("TimerPage mounted with:", {
      tasks: tasks.length,
      selectedTaskId,
      initialSelectedTask: selectedTask
    });
  }, []);
  
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
    
    // Lookup the task from the context tasks array
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      console.log("TimerPage: Found task in context:", task);
      setSelectedTask(task);
      
      // If it's not already a timer task, convert it
      if (task.taskType !== 'timer') {
        timerTasksManager.updateTaskDuration(task.id, task.duration || 1500);
      }
    } else {
      console.log("TimerPage: Task not found in context, checking localStorage");
      
      // Try to find the task in localStorage
      try {
        const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
        const storedTask = storedTasks.find((t: Task) => t.id === taskId);
        
        if (storedTask) {
          console.log("TimerPage: Found task in localStorage:", storedTask);
          // Force a task update through the timer tasks manager
          if (storedTask.taskType !== 'timer') {
            timerTasksManager.updateTaskDuration(storedTask.id, storedTask.duration || 1500);
            setTimeout(() => {
              timerTasksManager.forceTaskUpdate();
            }, 100);
          }
          setSelectedTask(storedTask);
        } else {
          console.warn("TimerPage: Task not found in localStorage either:", taskId);
        }
      } catch (e) {
        console.error("TimerPage: Error processing task:select from localStorage", e);
      }
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
  }, [tasks, habitCheckDone, timerTasksManager]);

  // Listen for force-task-update events
  useEffect(() => {
    const handleForceUpdate = () => {
      console.log("TimerPage: Force update detected, incrementing update counter");
      setForceUpdate(prev => prev + 1); // Trigger a re-render
      
      // Reload selected task if it exists
      if (selectedTask) {
        try {
          const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
          const updatedTask = storedTasks.find((t: Task) => t.id === selectedTask.id);
          
          if (updatedTask) {
            console.log("TimerPage: Updating selected task after force update", updatedTask);
            setSelectedTask(updatedTask);
          }
        } catch (e) {
          console.error("TimerPage: Error updating selected task after force update", e);
        }
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [selectedTask]);

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
