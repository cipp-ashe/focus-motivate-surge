
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
  
  // Initialize task schedulers and get the check function
  const { checkForMissingHabitTasks } = useHabitTaskScheduler(tasks);
  useTemplateTasksManager(tasks);

  // Force tag update when task list changes
  useEffect(() => {
    if (tasks.length > 0) {
      console.log(`TaskManager: Task list updated with ${tasks.length} tasks`);
      eventBus.emit('task:tags-update', { count: tasks.length });
      setIsLoading(false);
    } else {
      // If there are no tasks, we need to check if they exist in storage
      const storedTasks = JSON.parse(localStorage.getItem('taskList') || '[]');
      if (storedTasks.length > 0) {
        console.log('Tasks found in storage but not in state, forcing reload');
        forceTaskUpdate();
      } else {
        setIsLoading(false);
      }
    }
  }, [tasks, forceTaskUpdate]);
  
  // Check for pending habits only once when TaskManager first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskManager mounted, performing initial habits check');
    initialCheckDoneRef.current = true;
    setIsLoading(true);
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      checkPendingHabits();
      
      // Double-check after a slightly longer delay to catch any that might have been missed
      setTimeout(() => {
        checkForMissingHabitTasks();
        // Force localStorage sync and UI update
        window.dispatchEvent(new Event('force-task-update'));
        setIsLoading(false);
      }, 300);
    }, 300);
    
    // Set a timeout to stop loading state in case no tasks are found
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(loadingTimeout);
    };
  }, [checkPendingHabits, checkForMissingHabitTasks]);

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
