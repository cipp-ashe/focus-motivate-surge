import React, { useCallback, useEffect, useState } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskEventHandler } from './TaskEventHandler';
import { Task, Tag } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface TaskManagerProps {
  isTimerView?: boolean;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
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
  
  const handleTaskAdd = useCallback((task: Task) => {
    console.log("TaskManager: Adding task", task);
    if (addTask) {
      if (isTimerView && !task.taskType) {
        task.taskType = 'timer';
      }
      if (location.pathname.includes('/timer') && !task.taskType) {
        task.taskType = 'timer';
      }
      if (!task.taskType && task.tags && task.tags.some(tag => 
        typeof tag === 'object' && tag.name === 'timer')) {
        task.taskType = 'timer';
      }
      addTask(task);
      eventManager.emit('task:create', task);
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
        if (isTimerView && !task.taskType) {
          task.taskType = 'timer';
        }
        if (location.pathname.includes('/timer') && !task.taskType) {
          task.taskType = 'timer';
        }
        if (!task.taskType && task.tags && task.tags.some(tag => 
          typeof tag === 'object' && tag.name === 'timer')) {
          task.taskType = 'timer';
        }
        addTask(task);
        eventManager.emit('task:create', task);
      });
      window.dispatchEvent(new Event('force-task-update'));
      toast.success(`Added ${tasks.length} tasks`);
    } else {
      console.error("TaskManager: addTask function is undefined");
      toast.error("Failed to add tasks: Application error");
    }
  }, [addTask, isTimerView, location.pathname]);
  
  const forceUpdate = useCallback(() => {
    console.log("TaskManager: Force update called - triggering UI refresh");
    setForceUpdateCounter(prev => prev + 1);
    
    const storedTasks = taskStorage.loadTasks();
    if (storedTasks.length > 0 && (!items || items.length < storedTasks.length)) {
      console.log("TaskManager: Found missing tasks in memory, refreshing from storage");
      eventManager.emit('task:reload', {});
    }
  }, [items]);
  
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
  
  useEffect(() => {
    if (isTimerView) {
      console.log("TaskManager (Timer View): Setting up special timer task handlers");
      
      const refreshTimerTasks = () => {
        console.log("TaskManager (Timer View): Refreshing timer tasks");
        
        const storedTasks = taskStorage.loadTasks();
        const timerTasks = storedTasks.filter(task => 
          task.taskType === 'timer' || task.taskType === 'focus'
        );
        
        if (timerTasks.length > 0) {
          console.log(`TaskManager (Timer View): Found ${timerTasks.length} timer tasks in storage`);
          forceUpdate();
        }
      };
      
      eventManager.on('timer:task-set', refreshTimerTasks);
      setTimeout(refreshTimerTasks, 200);
      
      return () => {
        eventManager.off('timer:task-set', refreshTimerTasks);
      };
    }
  }, [isTimerView, forceUpdate]);
  
  useEffect(() => {
    console.log("TaskManager: Route changed to", location.pathname);
    
    const timeout = setTimeout(() => {
      forceUpdate();
      
      eventManager.emit('task:reload', {});
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [location.pathname]);
  
  const handleTaskComplete = useCallback(({ taskId, metrics }) => {
    console.log("TaskManager: Completing task", taskId, "with metrics:", metrics);
    if (taskContext?.completeTask) {
      taskContext.completeTask(taskId, metrics);
      toast.success(`Task completed!`);
    }
  }, [taskContext]);
  
  return (
    <div className="space-y-4">
      <TaskEventHandler 
        onForceUpdate={forceUpdate}
        onTaskCreate={handleTaskAdd}
        onTaskUpdate={({taskId, updates}) => taskContext?.updateTask(taskId, updates)}
        onTaskDelete={({taskId}) => taskContext?.deleteTask(taskId)}
        onTaskComplete={handleTaskComplete}
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
