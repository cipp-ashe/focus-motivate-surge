
import React, { useEffect, useRef, useState } from 'react';
import { TaskList } from './TaskList';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTagSystem } from '@/hooks/useTagSystem';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
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

  // Add a loading state to prevent white screen
  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  const handleTaskAdd = (task: Task) => {
    console.log("TaskManager - Adding task:", task);
    
    // Use event bus to create the task
    eventBus.emit('task:create', task);
    toast.info("Adding task...");
    
    // Force UI update after a delay
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, 200);
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManager - Adding ${tasks.length} tasks`);
    
    // Add tasks with staggered timing to prevent race conditions
    tasks.forEach((task, index) => {
      setTimeout(() => {
        eventBus.emit('task:create', task);
      }, index * 100); // 100ms delay between each task creation
    });
    
    toast.info(`Adding ${tasks.length} tasks...`);
    
    // Force UI update after all tasks should be added
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
    }, tasks.length * 100 + 200);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/10">
        <TaskInput 
          onTaskAdd={handleTaskAdd} 
          onTasksAdd={handleTasksAdd}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <TaskList
          tasks={tasks}
          selectedTasks={selectedTaskId ? [selectedTaskId] : []}
          onTaskClick={(taskId) => eventBus.emit('task:select', taskId)}
        />
      </div>
    </div>
  );
};

export default TaskManager;
