
import React, { useCallback, useEffect, useState } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskEventHandler } from './TaskEventHandler';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

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
  
  // Task management functionality
  const handleTaskAdd = useCallback((task: Task) => {
    console.log("TaskManager: Adding task", task);
    if (addTask) {
      addTask(task);
      
      // Emit via event manager (removed eventBus.emit)
      eventManager.emit('task:create', task);
      
      toast.success(`Task added: ${task.name}`);
    } else {
      console.error("TaskManager: addTask function is undefined");
      toast.error("Failed to add task: Application error");
    }
  }, [addTask]);
  
  const handleTasksAdd = useCallback((tasks: Task[]) => {
    console.log("TaskManager: Adding multiple tasks", tasks);
    if (addTask) {
      tasks.forEach(task => {
        addTask(task);
        
        // Emit via event manager (removed eventBus.emit)
        eventManager.emit('task:create', task);
      });
      
      toast.success(`Added ${tasks.length} tasks`);
    } else {
      console.error("TaskManager: addTask function is undefined");
      toast.error("Failed to add tasks: Application error");
    }
  }, [addTask]);
  
  // Force refresh handler to be passed to event handler
  const forceUpdate = useCallback(() => {
    console.log("TaskManager: Force update called - triggering UI refresh");
    setForceUpdateCounter(prev => prev + 1);
  }, []);
  
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
  
  // Special handling for timer view
  useEffect(() => {
    if (isTimerView) {
      console.log("TaskManager (Timer View): Setting up special timer task handlers");
      
      // This will ensure timer-related tasks are properly displayed
      const refreshTimerTasks = () => {
        console.log("TaskManager (Timer View): Refreshing timer tasks");
        forceUpdate();
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
