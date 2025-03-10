
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
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  // Initialize local tasks from context
  useEffect(() => {
    console.log("TaskManager - Received tasks from context:", tasks);
    setLocalTasks(tasks);
  }, [tasks]);
  
  // Debug: Log tasks whenever they change
  useEffect(() => {
    console.log("TaskManager - Current tasks:", localTasks);
    
    // Set maximum loading time to prevent infinite loading state
    if (isLoading && localTasks.length > 0) {
      setIsLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
  }, [localTasks, isLoading]);

  // Listen for task-related events
  useEffect(() => {
    console.log("TaskManager - Setting up event listeners");
    
    const handleTaskCreate = (task: Task) => {
      console.log("TaskManager - Task created event received:", task);
      setLocalTasks(prev => {
        // Avoid adding duplicate tasks
        if (prev.some(t => t.id === task.id)) return prev;
        return [...prev, task];
      });
    };
    
    const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
      console.log("TaskManager - Task update event received:", data);
      setLocalTasks(prev => 
        prev.map(t => t.id === data.taskId ? { ...t, ...data.updates } : t)
      );
    };
    
    const handleTaskDelete = (data: { taskId: string }) => {
      console.log("TaskManager - Task delete event received:", data);
      setLocalTasks(prev => 
        prev.filter(t => t.id !== data.taskId)
      );
    };
    
    const handleForceUpdate = () => {
      console.log("TaskManager - Force update event received");
      // Force reload from storage to ensure we have the latest data
      const storedTasks = taskStorage.loadTasks();
      console.log("TaskManager - Reloaded tasks from storage:", storedTasks);
      setLocalTasks(storedTasks);
    };
    
    // Subscribe to events
    const unsubCreate = eventBus.on('task:create', handleTaskCreate);
    const unsubUpdate = eventBus.on('task:update', handleTaskUpdate);
    const unsubDelete = eventBus.on('task:delete', handleTaskDelete);
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      // Unsubscribe from events
      unsubCreate();
      unsubUpdate();
      unsubDelete();
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, []);

  // Set up a loading timeout
  useEffect(() => {
    if (isLoading && !loadingTimeoutRef.current) {
      loadingTimeoutRef.current = setTimeout(() => {
        console.log("TaskManager - Loading timeout reached, forcing state to loaded");
        setIsLoading(false);
        
        // Force an update from storage
        const storedTasks = taskStorage.loadTasks();
        console.log("TaskManager - Loaded tasks from storage after timeout:", storedTasks);
        setLocalTasks(storedTasks);
        
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
        
        // Add to storage first
        taskStorage.addTask(task);
        
        // Emit creation event
        console.log(`TaskManager - Creating task ${i + 1}/${taskQueueRef.current.length}:`, task);
        eventBus.emit('task:create', task);
        
        // Add a small delay between task creations
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Clear queue and release processing lock
      taskQueueRef.current = [];
      
      // Force a UI update after all tasks are processed
      setTimeout(() => {
        console.log("TaskManager - Force updating UI after queue processing");
        window.dispatchEvent(new CustomEvent('force-task-update'));
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
    
    // Load initial tasks from storage
    const storedTasks = taskStorage.loadTasks();
    console.log("TaskManager - Initial load from storage:", storedTasks);
    setLocalTasks(storedTasks);
    
    // Check for pending habits on mount with a small delay
    const timeout = setTimeout(() => {
      eventBus.emit('habits:check-pending', {});
      
      // Force a UI update after a delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('force-task-update'));
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
    
    // Add to storage first
    taskStorage.addTask(task);
    
    // Add to local state immediately for responsive UI
    setLocalTasks(prev => {
      if (prev.some(t => t.id === task.id)) return prev;
      return [...prev, task];
    });
    
    // Add to processing queue for event emission
    taskQueueRef.current.push(task);
    
    // Show toast
    toast.success(`Added task: ${task.name}`);
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManager - Adding ${tasks.length} tasks`);
    
    // Add all tasks to storage
    tasks.forEach(task => taskStorage.addTask(task));
    
    // Add to local state immediately for responsive UI
    setLocalTasks(prev => {
      // Filter out duplicates
      const newTasks = tasks.filter(task => !prev.some(t => t.id === task.id));
      return [...prev, ...newTasks];
    });
    
    // Add all tasks to the queue
    taskQueueRef.current.push(...tasks);
    
    // Show toast
    toast.success(`Added ${tasks.length} tasks`);
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
          tasks={localTasks}
          selectedTasks={selectedTaskId ? [selectedTaskId] : []}
          onTaskClick={(taskId) => eventBus.emit('task:select', taskId)}
        />
      </div>
    </div>
  );
};

export default TaskManager;
