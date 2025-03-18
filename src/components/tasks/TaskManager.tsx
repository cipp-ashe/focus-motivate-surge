import React, { useCallback, useEffect, useState } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskEventHandler } from './TaskEventHandler';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useLocation } from 'react-router-dom';

interface TaskManagerProps {
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

const TaskManager: React.FC<TaskManagerProps> = ({
  isTimerView = false,
  dialogOpeners
}) => {
  const taskContext = useTaskContext();
  const items = taskContext?.items || [];
  const completed = taskContext?.completed || [];
  const selectedTaskId = taskContext?.selected || null;
  const addTask = taskContext?.addTask;
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const location = useLocation();
  
  // Task management functionality
  const handleTaskAdd = useCallback((task: Task) => {
    console.log("TaskManager: Adding task", task);
    if (addTask) {
      // Ensure the task has an appropriate taskType based on the current view
      // and route
      if (isTimerView && !task.taskType) {
        task.taskType = 'timer';
      }
      
      // If we're on the timer route, ensure timer taskType regardless of view
      if (location.pathname.includes('/timer') && !task.taskType) {
        task.taskType = 'timer';
      }
      
      // If task has tags but not taskType, check for timer tags
      if (!task.taskType && task.tags && task.tags.includes('timer')) {
        task.taskType = 'timer';
      }
      
      addTask(task);
      
      // Emit via event manager
      eventManager.emit('task:create', task);
      
      // Force a global task state update to ensure all views are updated
      window.dispatchEvent(new Event('force-task-update'));
      
      toast.success(`Task added: ${task.name}`);
    } else {
      console.error("TaskManager: addTask function is undefined");
      toast.error("Failed to add task: Application error");
    }
  }, [addTask, isTimerView, location.pathname]);
  
  const handleTasksAdd = useCallback((tasks: Task[]) => {
    console.log("TaskManager: Adding multiple tasks", tasks);
    if (addTask) {
      tasks.forEach(task => {
        // Ensure the task has an appropriate taskType based on the current view
        // and route
        if (isTimerView && !task.taskType) {
          task.taskType = 'timer';
        }
        
        // If we're on the timer route, ensure timer taskType regardless of view
        if (location.pathname.includes('/timer') && !task.taskType) {
          task.taskType = 'timer';
        }
        
        // If task has tags but not taskType, check for timer tags
        if (!task.taskType && task.tags && task.tags.includes('timer')) {
          task.taskType = 'timer';
        }
        
        addTask(task);
        
        // Emit via event manager
        eventManager.emit('task:create', task);
      });
      
      // Force a global task state update
      window.dispatchEvent(new Event('force-task-update'));
      
      toast.success(`Added ${tasks.length} tasks`);
    } else {
      console.error("TaskManager: addTask function is undefined");
      toast.error("Failed to add tasks: Application error");
    }
  }, [addTask, isTimerView, location.pathname]);
  
  // Force refresh handler to be passed to event handler
  const forceUpdate = useCallback(() => {
    console.log("TaskManager: Force update called - triggering UI refresh");
    setForceUpdateCounter(prev => prev + 1);
    
    // Also verify tasks from storage to ensure consistency
    const storedTasks = taskStorage.loadTasks();
    if (storedTasks.length > 0 && (!items || items.length < storedTasks.length)) {
      console.log("TaskManager: Found missing tasks in memory, refreshing from storage");
      eventManager.emit('task:reload', {});
    }
  }, [items]);
  
  // Set up refresh on UI refresh events
  useEffect(() => {
    const handleTaskUiRefresh = () => {
      console.log("TaskManager: Received task-ui-refresh event");
      forceUpdate();
    };
    
    const handleForceUpdate = () => {
      console.log("TaskManager: Received force-task-update event");
      forceUpdate();
    };
    
    window.addEventListener('task-ui-refresh', handleTaskUiRefresh);
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('task-ui-refresh', handleTaskUiRefresh);
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [forceUpdate]);
  
  // Special handling for timer view - ensure proper task filtering based on task type
  useEffect(() => {
    if (isTimerView) {
      console.log("TaskManager (Timer View): Setting up special timer task handlers");
      
      // This will ensure timer-related tasks are properly displayed
      const refreshTimerTasks = () => {
        console.log("TaskManager (Timer View): Refreshing timer tasks");
        
        // Check if we need to reload tasks from storage
        const storedTasks = taskStorage.loadTasks();
        const timerTasks = storedTasks.filter(task => 
          task.taskType === 'timer' || task.taskType === 'focus'
        );
        
        if (timerTasks.length > 0) {
          console.log(`TaskManager (Timer View): Found ${timerTasks.length} timer tasks in storage`);
          // Force update to refresh the UI
          forceUpdate();
        }
      };
      
      // Use only eventManager instead of both systems
      eventManager.on('timer:task-set', refreshTimerTasks);
      
      // Immediately trigger a refresh to ensure timer tasks are loaded
      setTimeout(refreshTimerTasks, 200);
      
      return () => {
        eventManager.off('timer:task-set', refreshTimerTasks);
      };
    }
  }, [isTimerView, forceUpdate]);
  
  // Force refresh when route changes to ensure consistent tasks
  useEffect(() => {
    console.log("TaskManager: Route changed to", location.pathname);
    
    // Force a reload of tasks when we navigate to ensure consistency
    const timeout = setTimeout(() => {
      forceUpdate();
      
      // Also reload tasks from storage to ensure we have the latest
      eventManager.emit('task:reload', {});
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [location.pathname]);
  
  return (
    <div className="space-y-4">
      <TaskEventHandler 
        onForceUpdate={forceUpdate}
        onTaskCreate={handleTaskAdd}
        onTaskUpdate={({taskId, updates}) => taskContext?.updateTask(taskId, updates)}
        onTaskDelete={({taskId}) => taskContext?.deleteTask(taskId)}
        tasks={items}
      />
      
      <TaskManagerContent
        key={`task-manager-content-${forceUpdateCounter}`}
        tasks={items}
        completedTasks={completed}
        selectedTaskId={selectedTaskId}
        isTimerView={isTimerView}
        dialogOpeners={dialogOpeners}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
      />
    </div>
  );
};

export default TaskManager;
