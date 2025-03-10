
import React, { useEffect, useRef, useState } from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTagSystem } from '@/hooks/useTagSystem';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { useHabitTaskScheduler } from '@/hooks/tasks/useHabitTaskScheduler';
import { useTemplateTasksManager } from '@/hooks/tasks/useTemplateTasksManager';
import { useTasksNavigation } from '@/hooks/tasks/useTasksNavigation';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
  const { handleTimerStart } = useTimerEvents();
  const { getEntityTags } = useTagSystem();
  const { deleteTask, updateTask, checkPendingHabits, forceTaskUpdate } = useTaskEvents();
  const { currentPath } = useTasksNavigation();
  const initialCheckDoneRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tasksExistRef = useRef(false);
  const forceUpdateTimeRef = useRef(0);
  
  // Initialize task schedulers and get the check function
  const { checkForMissingHabitTasks } = useHabitTaskScheduler(tasks);
  useTemplateTasksManager(tasks);

  // Force tag update when task list changes and ensure loading state is properly handled
  useEffect(() => {
    // Set maximum loading time to prevent infinite loading state
    if (isLoading && !loadingTimeoutRef.current) {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        loadingTimeoutRef.current = null;
      }, 1000);
    }
    
    if (tasks.length > 0) {
      tasksExistRef.current = true;
      console.log(`TaskManager: Task list updated with ${tasks.length} tasks`);
      
      // Clear memory tracking on load
      if (!localStorage.getItem('tasks-in-memory')) {
        const taskIds = tasks.map(t => t.id);
        localStorage.setItem('tasks-in-memory', JSON.stringify(taskIds));
        console.log(`TaskManager: Initialized memory tracking with ${taskIds.length} tasks`);
      }
      
      // Only update tags once per 800ms to prevent event flood
      const now = Date.now();
      if (now - forceUpdateTimeRef.current > 800) {
        forceUpdateTimeRef.current = now;
        eventBus.emit('task:tags-update', { count: tasks.length });
      }
      
      setIsLoading(false);
      
      // Clear loading timeout if tasks are loaded
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    } else if (tasksExistRef.current) {
      // If tasks previously existed but now don't, this is probably an issue
      console.log('Tasks were previously loaded but now none exist, forcing reload');
      
      // Only force update if it's been a while since the last update
      const now = Date.now();
      if (now - forceUpdateTimeRef.current > 1000) {
        forceUpdateTimeRef.current = now;
        forceTaskUpdate();
      }
    } else {
      // Check local storage for tasks
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      if (storedTasks.length > 0) {
        console.log('Tasks found in storage but not in state, forcing reload');
        
        // Only force update if it's been a while since the last update
        const now = Date.now();
        if (now - forceUpdateTimeRef.current > 1000) {
          forceUpdateTimeRef.current = now;
          forceTaskUpdate();
        }
        
        // Set a timeout to end loading state if still no tasks
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } else {
        setIsLoading(false);
      }
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [tasks, forceTaskUpdate]);
  
  // Check for pending habits only once when TaskManager first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskManager mounted, performing initial habits check');
    initialCheckDoneRef.current = true;
    
    // Ensure loading state starts as true
    setIsLoading(true);
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      checkPendingHabits();
      
      // Double-check after a slightly longer delay to catch any that might have been missed
      setTimeout(() => {
        checkForMissingHabitTasks();
        
        // After verification is complete, force a UI update
        setTimeout(() => {
          // Log all habit tasks in localStorage for debugging
          const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
          const habitTasks = storedTasks.filter((task: any) => task.relationships?.habitId);
          
          if (habitTasks.length > 0) {
            console.log(`TaskManager: Found ${habitTasks.length} habit tasks in storage:`, 
              habitTasks.map((t: any) => ({
                id: t.id,
                name: t.name,
                habitId: t.relationships?.habitId,
                date: t.relationships?.date
              }))
            );
            
            // Add these tasks to memory tracking
            const tasksInMemory = JSON.parse(localStorage.getItem('tasks-in-memory') || '[]');
            const newTaskIds = habitTasks.map((t: any) => t.id);
            const updatedMemoryList = [...new Set([...tasksInMemory, ...newTaskIds])];
            localStorage.setItem('tasks-in-memory', JSON.stringify(updatedMemoryList));
            
            // Force one more task update
            forceTaskUpdate();
          }
          
          setIsLoading(false);
        }, 100);
      }, 200);
    }, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [checkPendingHabits, checkForMissingHabitTasks, forceTaskUpdate]);

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
      eventBus.emit('task:select', taskId);
    }
  };

  const handleActiveTasksClear = () => {
    tasks.forEach(task => {
      deleteTask(task.id, 'manual');
    });
  };

  const handleCompletedTasksClear = () => {
    completedTasks.forEach(task => {
      deleteTask(task.id, 'completed');
    });
  };

  // Add a loading state to prevent white screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  // Log task details for debugging
  console.log(`TaskManager rendering: ${tasks.length} tasks, selected: ${selectedTaskId || 'none'}`);
  
  // No tasks view
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4">
        <p className="text-muted-foreground">No tasks available</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={() => {
            const now = Date.now();
            if (now - forceUpdateTimeRef.current > 1000) {
              forceUpdateTimeRef.current = now;
              // Check localStorage directly
              const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
              if (storedTasks.length > 0) {
                toast.info(`${storedTasks.length} tasks found in storage`, {
                  description: "Attempting to load tasks from storage..."
                });
              }
              checkPendingHabits();
              forceTaskUpdate();
            }
          }}
        >
          Refresh Tasks
        </button>
      </div>
    );
  }

  return (
    <TaskList
      tasks={tasks}
      selectedTasks={selectedTaskId ? [selectedTaskId] : []}
      onTaskClick={(task) => handleTaskClick(task.id)}
      onTaskDelete={(taskId) => deleteTask(taskId, 'manual')}
      onTasksUpdate={updateTask}
      onTasksClear={handleActiveTasksClear}
      onCompletedTasksClear={handleCompletedTasksClear}
    />
  );
};

export default TaskManager;
