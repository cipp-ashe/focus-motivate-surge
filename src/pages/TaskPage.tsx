
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { TaskInput } from '@/components/tasks/TaskInput';
import { TaskTable } from '@/components/tasks/TaskTable';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventBus } from '@/lib/eventBus';

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Load tasks on mount
  useEffect(() => {
    console.log('TaskPage mounted, loading tasks');
    const storedTasks = taskStorage.loadTasks();
    console.log('TaskPage - Loaded tasks from storage:', storedTasks);
    setTasks(storedTasks);
    
    // Listen for task creation events
    const handleTaskCreate = (task: Task) => {
      console.log('TaskPage - Task created event received:', task);
      setTasks(prev => {
        // Avoid adding duplicate tasks
        if (prev.some(t => t.id === task.id)) return prev;
        return [...prev, task];
      });
    };
    
    // Listen for task update events
    const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
      console.log('TaskPage - Task updated event received:', data);
      setTasks(prev => 
        prev.map(t => t.id === data.taskId ? { ...t, ...data.updates } : t)
      );
    };
    
    // Listen for task deletion events
    const handleTaskDelete = (data: { taskId: string }) => {
      console.log('TaskPage - Task deleted event received:', data);
      setTasks(prev => 
        prev.filter(t => t.id !== data.taskId)
      );
      if (selectedTaskId === data.taskId) {
        setSelectedTaskId(null);
      }
    };
    
    // Listen for force update events
    const handleForceUpdate = () => {
      console.log('TaskPage - Force update event received');
      const updatedTasks = taskStorage.loadTasks();
      console.log('TaskPage - Reloaded tasks from storage:', updatedTasks);
      setTasks(updatedTasks);
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
  }, [selectedTaskId]);
  
  const handleTaskAdd = (task: Task) => {
    console.log('TaskPage - Task added manually:', task);
    // We'll let the event handlers update the state
    eventBus.emit('task:create', task);
  };
  
  const handleTasksAdd = (newTasks: Task[]) => {
    console.log(`TaskPage - ${newTasks.length} tasks added manually`);
    // We'll let the event handlers update the state
    newTasks.forEach(task => {
      eventBus.emit('task:create', task);
    });
  };
  
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold p-4">Task Manager (Simple)</h1>
      
      <div className="p-4 border-b border-border/10">
        <TaskInput 
          onTaskAdd={handleTaskAdd} 
          onTasksAdd={handleTasksAdd}
        />
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TaskTable
          tasks={tasks}
          selectedTasks={selectedTaskId ? [selectedTaskId] : []}
        />
      </div>
    </div>
  );
};

export default TaskPage;
