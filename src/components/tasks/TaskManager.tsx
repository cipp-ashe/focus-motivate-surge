
import React, { useCallback, useEffect, useState } from 'react';
import { TaskManagerContent } from './TaskManagerContent';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { TaskEventHandler } from './TaskEventHandler';

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
  const { items, completed } = useTaskContext();
  const [tasks, setTasks] = useState<Task[]>(items);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(completed);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Initialize tasks from context
  useEffect(() => {
    setTasks(items);
    setCompletedTasks(completed);
    
    // Listen for task selection events
    const handleTaskSelect = (taskId: string) => {
      setSelectedTaskId(taskId);
    };
    
    // Subscribe to events
    eventBus.on('task:select', handleTaskSelect);
    
    // Cleanup
    return () => {
      eventBus.off('task:select', handleTaskSelect);
    };
  }, [items, completed]);
  
  // Handle task creation
  const handleTaskAdd = useCallback((task: Task) => {
    setTasks(prev => {
      // Check if task already exists
      if (prev.some(t => t.id === task.id)) {
        return prev;
      }
      return [...prev, task];
    });
  }, []);
  
  // Handle multiple tasks addition
  const handleTasksAdd = useCallback((newTasks: Task[]) => {
    setTasks(prev => {
      const uniqueTasks = newTasks.filter(task => 
        !prev.some(t => t.id === task.id)
      );
      return [...prev, ...uniqueTasks];
    });
  }, []);
  
  // Handle task update events
  const handleTaskUpdate = useCallback((data: { taskId: string, updates: Partial<Task> }) => {
    const { taskId, updates } = data;
    
    // Check if task should move to completed
    if (updates.status === 'completed' || updates.completed) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Find the task to be moved
      const taskToComplete = tasks.find(task => task.id === taskId);
      
      if (taskToComplete) {
        const completedTask = { 
          ...taskToComplete, 
          ...updates, 
          completed: true,
          completedAt: updates.completedAt || new Date().toISOString()
        };
        
        setCompletedTasks(prev => [...prev, completedTask]);
      }
      return;
    }
    
    // Check if task should move to dismissed
    if (updates.status === 'dismissed') {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Find the task to be dismissed
      const taskToDismiss = tasks.find(task => task.id === taskId);
      
      if (taskToDismiss) {
        const dismissedTask = { 
          ...taskToDismiss, 
          ...updates, 
          dismissedAt: updates.dismissedAt || new Date().toISOString()
        };
        
        setCompletedTasks(prev => [...prev, dismissedTask]);
      }
      return;
    }
    
    // Regular update
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, [tasks]);
  
  // Handle task deletion
  const handleTaskDelete = useCallback((data: { taskId: string }) => {
    const { taskId } = data;
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTaskId(prev => prev === taskId ? null : prev);
  }, []);
  
  // Force refresh of task data
  const forceUpdate = useCallback(() => {
    console.log("TaskManager: Force update called, refreshing tasks from context");
    setTasks([...items]);
    setCompletedTasks([...completed]);
  }, [items, completed]);
  
  return (
    <div className="space-y-4">
      <TaskEventHandler
        tasks={tasks}
        onTaskCreate={handleTaskAdd}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onForceUpdate={forceUpdate}
      />
      
      <TaskManagerContent
        tasks={tasks}
        completedTasks={completedTasks}
        selectedTaskId={selectedTaskId}
        onTaskAdd={handleTaskAdd}
        onTasksAdd={handleTasksAdd}
        isTimerView={isTimerView}
        dialogOpeners={dialogOpeners}
      />
    </div>
  );
};

export default TaskManager;
