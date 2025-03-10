
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task, TaskType } from '@/types/tasks';
import { taskStorage } from '@/lib/storage/taskStorage';
import { TaskLoader } from './TaskLoader';
import { TaskEventHandler } from './TaskEventHandler';
import { TaskManagerContent } from './TaskManagerContent';
import { useLocation } from 'react-router-dom';
import { useTimerTasksManager } from '@/hooks/tasks/useTimerTasksManager';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface TaskManagerProps {
  isTimerView?: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ isTimerView }) => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const location = useLocation();
  const timerTasksManager = useTimerTasksManager();
  const isMountedRef = useRef(true);
  const isMobile = useIsMobile();
  
  // Auto-detect timer view if not explicitly provided
  const isTimerPage = isTimerView ?? location.pathname.includes('/timer');
  
  // Initialize local tasks from context - with dependencies properly declared
  useEffect(() => {
    // If in timer view, filter only timer tasks
    if (isTimerPage) {
      const timerTasks = tasks.filter(task => task.taskType === 'timer');
      setLocalTasks(timerTasks);
    } else {
      setLocalTasks(tasks);
    }
  }, [tasks, isTimerPage]); // Only re-run when tasks or isTimerPage changes
  
  // Listen for force updates with the new event system - with proper cleanup
  useEffect(() => {
    const handleForceUpdate = () => {
      if (!isMountedRef.current) return;
      
      // Force reload from storage to ensure we have the latest data
      const storedTasks = taskStorage.loadTasks();
      
      if (isTimerPage) {
        const timerTasks = storedTasks.filter(task => task.taskType === 'timer');
        setLocalTasks(timerTasks);
      } else {
        setLocalTasks(storedTasks);
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    
    return () => {
      window.removeEventListener('force-task-update', handleForceUpdate);
    };
  }, [isTimerPage]); // Only re-run when isTimerPage changes

  // Set mounted flag cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleTaskCreate = useCallback((task: Task) => {
    if (!isMountedRef.current) return;
    
    if (isTimerPage && task.taskType !== 'timer') {
      return; // Only add timer tasks in timer view
    }
    
    setLocalTasks(prev => {
      // Avoid adding duplicate tasks
      if (prev.some(t => t.id === task.id)) return prev;
      return [...prev, task];
    });
  }, [isTimerPage]);
  
  const handleTaskUpdate = useCallback((data: { taskId: string, updates: Partial<Task> }) => {
    if (!isMountedRef.current) return;
    
    setLocalTasks(prev => 
      prev.map(t => t.id === data.taskId ? { ...t, ...data.updates } : t)
    );
  }, []);
  
  const handleTaskDelete = useCallback((data: { taskId: string }) => {
    if (!isMountedRef.current) return;
    
    setLocalTasks(prev => 
      prev.filter(t => t.id !== data.taskId)
    );
  }, []);
  
  const handleForceUpdate = useCallback(() => {
    if (!isMountedRef.current) return;
    
    // Force reload from storage to ensure we have the latest data
    const storedTasks = taskStorage.loadTasks();
    
    if (isTimerPage) {
      const timerTasks = storedTasks.filter(task => task.taskType === 'timer');
      setLocalTasks(timerTasks);
    } else {
      setLocalTasks(storedTasks);
    }
  }, [isTimerPage]);
  
  const handleTaskAdd = useCallback((task: Task) => {
    if (!isMountedRef.current) return;
    
    // In timer view, only add timer tasks or auto-convert to timer task
    if (isTimerPage) {
      if (task.taskType !== 'timer') {
        const updatedTask: Task = {
          ...task,
          taskType: 'timer' as TaskType
        };
        setLocalTasks(prev => {
          if (prev.some(t => t.id === updatedTask.id)) return prev;
          return [...prev, updatedTask];
        });
      } else {
        setLocalTasks(prev => {
          if (prev.some(t => t.id === task.id)) return prev;
          return [...prev, task];
        });
      }
    } else {
      // Add to local state immediately for responsive UI
      setLocalTasks(prev => {
        if (prev.some(t => t.id === task.id)) return prev;
        return [...prev, task];
      });
    }
  }, [isTimerPage]);

  const handleTasksAdd = useCallback((tasks: Task[]) => {
    if (!isMountedRef.current) return;
    
    // In timer view, only add timer tasks or auto-convert to timer tasks
    if (isTimerPage) {
      const tasksToAdd = tasks.map(task => {
        if (task.taskType !== 'timer') {
          return {
            ...task,
            taskType: 'timer' as TaskType
          };
        }
        return task;
      });
      
      if (tasksToAdd.length === 0) return;
      
      // Add to local state immediately for responsive UI
      setLocalTasks(prev => {
        // Filter out duplicates
        const newTasks = tasksToAdd.filter(task => !prev.some(t => t.id === task.id));
        return [...prev, ...newTasks];
      });
    } else {
      // Normal view, add all tasks
      setLocalTasks(prev => {
        // Filter out duplicates
        const newTasks = tasks.filter(task => !prev.some(t => t.id === task.id));
        return [...prev, ...newTasks];
      });
    }
  }, [isTimerPage]);

  // Add mobile-specific classes
  const containerClasses = isMobile ? "pb-16" : "";

  return (
    <div className={containerClasses}>
      <TaskLoader onTasksLoaded={setLocalTasks}>
        <TaskEventHandler
          tasks={localTasks}
          onTaskCreate={handleTaskCreate}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onForceUpdate={handleForceUpdate}
        />
        <TaskManagerContent 
          tasks={localTasks}
          selectedTaskId={selectedTaskId}
          onTaskAdd={handleTaskAdd}
          onTasksAdd={handleTasksAdd}
          isTimerView={isTimerPage}
        />
      </TaskLoader>
    </div>
  );
};

export default TaskManager;
