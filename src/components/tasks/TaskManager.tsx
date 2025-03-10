
import React, { useEffect, useRef, useState } from 'react';
import { TaskList } from './TaskList';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTagSystem } from '@/hooks/useTagSystem';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { taskStorage } from '@/lib/storage/taskStorage';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const TaskManager = () => {
  const { items: tasks, selected: selectedTaskId, completed: completedTasks } = useTaskContext();
  const { getEntityTags } = useTagSystem();
  const initialCheckDoneRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const taskQueueRef = useRef<Task[]>([]);
  const processingRef = useRef(false);
  
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
  
  // Process task queue with staggered timing to prevent race conditions
  useEffect(() => {
    if (processingRef.current || taskQueueRef.current.length === 0) return;
    
    processingRef.current = true;
    
    const processQueue = async () => {
      console.log(`TaskManager - Processing queue with ${taskQueueRef.current.length} tasks`);
      
      for (let i = 0; i < taskQueueRef.current.length; i++) {
        const task = taskQueueRef.current[i];
        
        // Check if task already exists to prevent duplicates
        const exists = taskStorage.taskExistsById(task.id);
        if (!exists) {
          console.log(`TaskManager - Creating task ${i + 1}/${taskQueueRef.current.length}:`, task);
          eventBus.emit('task:create', task);
          
          // Add a small delay between task creations
          await new Promise(resolve => setTimeout(resolve, 150));
        } else {
          console.log(`TaskManager - Task ${task.id} already exists, skipping`);
        }
      }
      
      // Clear queue and release processing lock
      taskQueueRef.current = [];
      
      // Force a UI update after all tasks are processed
      setTimeout(() => {
        console.log("TaskManager - Force updating UI after queue processing");
        window.dispatchEvent(new Event('force-task-update'));
        processingRef.current = false;
      }, 300);
    };
    
    // Start processing with a small delay
    setTimeout(processQueue, 50);
  }, [taskQueueRef.current.length]);
  
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
    
    // Add to processing queue instead of direct emission
    taskQueueRef.current.push(task);
    toast.info("Adding task...");
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManager - Adding ${tasks.length} tasks`);
    
    // Add all tasks to the queue
    taskQueueRef.current.push(...tasks);
    toast.info(`Adding ${tasks.length} tasks...`);
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
