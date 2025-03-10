
import React, { useEffect, useRef, useState } from 'react';
import { TaskList } from './TaskList';
import { useTimerEvents } from '@/hooks/timer/useTimerEvents';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTagSystem } from '@/hooks/useTagSystem';
import { eventBus } from '@/lib/eventBus';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
  const { handleTimerStart } = useTimerEvents();
  const { getEntityTags } = useTagSystem();
  const initialCheckDoneRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debug: Log tasks whenever they change
  useEffect(() => {
    console.log("TaskManager - Current tasks:", tasks);
    
    // Set maximum loading time to prevent infinite loading state
    if (isLoading && tasks.length > 0) {
      setIsLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  }, [tasks, isLoading]);

  // Set up a loading timeout
  useEffect(() => {
    if (isLoading && !loadingTimeoutRef.current) {
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        loadingTimeoutRef.current = null;
      }, 1000);
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [isLoading]);
  
  // Check for pending habits only once when TaskManager first mounts
  useEffect(() => {
    if (initialCheckDoneRef.current) return;
    
    console.log('TaskManager mounted, performing initial habits check');
    initialCheckDoneRef.current = true;
    
    // Ensure loading state starts as true
    setIsLoading(true);
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      eventBus.emit('habits:check-pending', {});
      
      // Force a UI update after a delay
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        setIsLoading(false);
      }, 300);
    }, 100);
    
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      handleTimerStart(task.name, task.duration || 1500);
      eventBus.emit('task:select', taskId);
    }
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
      onTaskClick={handleTaskClick}
    />
  );
};

export default TaskManager;
