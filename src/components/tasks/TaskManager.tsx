
import React, { useState, useEffect } from 'react';
import { TaskTable } from './TaskTable';
import { TaskInput } from './TaskInput';
import { activeTasksStorage } from '@/lib/storage/task/activeTasksStorage';
import { eventManager } from '@/lib/events/EventManager';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';

interface TaskManagerProps {
  dialogOpeners?: {
    checklist: (taskId: string, taskName: string, items: any[]) => void;
    journal: (taskId: string, taskName: string, entry: string) => void;
    screenshot: (imageUrl: string, taskName: string) => void;
    voicenote: (taskId: string, taskName: string) => void;
  };
}

const TaskManager: React.FC<TaskManagerProps> = ({ dialogOpeners }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  
  // Load initial tasks
  useEffect(() => {
    const loadedTasks = activeTasksStorage.loadTasks();
    setTasks(loadedTasks);
    console.log('TaskManager: Loaded tasks from storage:', loadedTasks.length);
    
    // Set up listener for task creation
    const handleTaskCreate = (task: Task) => {
      console.log('TaskManager: Task created', task);
      setTasks(prev => {
        if (prev.some(t => t.id === task.id)) return prev;
        return [...prev, task];
      });
    };
    
    // Set up listener for task updates
    const handleTaskUpdate = ({ taskId, updates }: { taskId: string, updates: Partial<Task> }) => {
      console.log('TaskManager: Task updated', taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      ));
    };
    
    // Set up listener for task deletion
    const handleTaskDelete = ({ taskId }: { taskId: string }) => {
      console.log('TaskManager: Task deleted', taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    };
    
    // Set up listener for task selection
    const handleTaskSelect = (taskId: string) => {
      console.log('TaskManager: Task selected', taskId);
      setSelectedTasks(prev => {
        if (prev.includes(taskId)) return prev;
        return [taskId];
      });
    };
    
    // Set up listener for force reload
    const handleForceReload = () => {
      console.log('TaskManager: Force reloading tasks');
      const reloadedTasks = activeTasksStorage.loadTasks();
      setTasks(reloadedTasks);
    };
    
    // Set up event subscriptions
    const unsubscribers = [
      eventBus.on('task:create', handleTaskCreate),
      eventBus.on('task:update', handleTaskUpdate),
      eventBus.on('task:delete', handleTaskDelete),
      eventBus.on('task:select', handleTaskSelect),
      eventBus.on('task:reload', handleForceReload),
    ];
    
    // We need to change this since eventManager.subscribe doesn't exist
    // Register event handlers individually with eventManager
    const unregisterCreate = eventManager.on('task:create', handleTaskCreate);
    const unregisterUpdate = eventManager.on('task:update', handleTaskUpdate);
    const unregisterDelete = eventManager.on('task:delete', handleTaskDelete);
    
    // Force update events
    const handleForceUpdate = () => {
      handleForceReload();
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    // Cleanup listeners
    return () => {
      unsubscribers.forEach(unsub => unsub());
      // Clean up eventManager listeners
      unregisterCreate();
      unregisterUpdate();
      unregisterDelete();
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, []);
  
  console.log('TaskManager: Rendering with dialogOpeners:', !!dialogOpeners);
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-lg border">
        <TaskInput 
          onTaskAdd={(task) => {
            eventBus.emit('task:create', task);
          }}
          onTasksAdd={(tasks) => {
            // Add this missing prop handler
            tasks.forEach(task => {
              eventBus.emit('task:create', task);
            });
          }} 
        />
      </div>
      
      <div className="bg-card rounded-lg border min-h-[60vh]">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Your Tasks</h2>
        </div>
        <div className="min-h-[calc(60vh-4rem)]">
          <TaskTable 
            tasks={tasks} 
            selectedTasks={selectedTasks}
            dialogOpeners={dialogOpeners}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
