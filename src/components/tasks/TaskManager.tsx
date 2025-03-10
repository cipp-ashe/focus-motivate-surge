
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
  const taskAddQueueRef = useRef<Task[]>([]);
  const processingTasksRef = useRef(false);
  
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

  // Process the task add queue one by one with delays
  useEffect(() => {
    const processQueue = async () => {
      if (processingTasksRef.current || taskAddQueueRef.current.length === 0) return;
      
      processingTasksRef.current = true;
      console.log(`TaskManager - Processing task queue with ${taskAddQueueRef.current.length} tasks`);
      
      // Process tasks one by one with delays
      while (taskAddQueueRef.current.length > 0) {
        const task = taskAddQueueRef.current.shift();
        if (task) {
          // Check if task already exists before emitting
          const taskExists = taskStorage.taskExistsById(task.id);
          
          if (!taskExists) {
            console.log(`TaskManager - Processing queued task: ${task.name}`);
            eventBus.emit('task:create', task);
            
            // Wait for task to be processed
            await new Promise(resolve => setTimeout(resolve, 150));
          } else {
            console.log(`TaskManager - Task ${task.id} already exists, skipping`);
          }
        }
      }
      
      // Force UI update after all tasks are processed
      window.dispatchEvent(new Event('force-task-update'));
      processingTasksRef.current = false;
    };

    processQueue();
  }, [taskAddQueueRef.current.length]);

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
    console.log("TaskManager - Adding task to queue:", task);
    
    // Add task to the queue instead of directly emitting
    taskAddQueueRef.current.push(task);
    toast.info("Adding task...");
    
    // This will trigger the queue processing effect
    taskAddQueueRef.current = [...taskAddQueueRef.current];
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManager - Adding ${tasks.length} tasks to queue`);
    
    // Add all tasks to the queue
    taskAddQueueRef.current.push(...tasks);
    toast.info(`Adding ${tasks.length} tasks...`);
    
    // This will trigger the queue processing effect
    taskAddQueueRef.current = [...taskAddQueueRef.current];
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
          onTaskClick={() => {}} // This is now unused as we're using event bus directly
        />
      </div>
    </div>
  );
};

export default TaskManager;
