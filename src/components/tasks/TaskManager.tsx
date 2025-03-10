
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { taskStorage } from '@/lib/storage/taskStorage';
import { TaskLoader } from './TaskLoader';
import { TaskEventHandler } from './TaskEventHandler';
import { TaskManagerContent } from './TaskManagerContent';
import { useLocation } from 'react-router-dom';

interface TaskManagerProps {
  isTimerView?: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ isTimerView }) => {
  const { items: tasks, selected: selectedTaskId } = useTaskContext();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const location = useLocation();
  
  // Auto-detect timer view if not explicitly provided
  const isTimerPage = isTimerView ?? location.pathname.includes('/timer');
  
  // Initialize local tasks from context
  useEffect(() => {
    console.log("TaskManager - Received tasks from context:", tasks);
    
    // If in timer view, filter only timer tasks
    if (isTimerPage) {
      const timerTasks = tasks.filter(task => task.taskType === 'timer');
      console.log("TaskManager - Filtered timer tasks:", timerTasks);
      setLocalTasks(timerTasks);
    } else {
      setLocalTasks(tasks);
    }
  }, [tasks, isTimerPage]);
  
  // Debug: Log tasks whenever they change
  useEffect(() => {
    console.log("TaskManager - Current tasks:", localTasks);
  }, [localTasks]);

  const handleTaskCreate = (task: Task) => {
    if (isTimerPage && task.taskType !== 'timer') {
      return; // Only add timer tasks in timer view
    }
    
    setLocalTasks(prev => {
      // Avoid adding duplicate tasks
      if (prev.some(t => t.id === task.id)) return prev;
      return [...prev, task];
    });
  };
  
  const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
    setLocalTasks(prev => 
      prev.map(t => t.id === data.taskId ? { ...t, ...data.updates } : t)
    );
  };
  
  const handleTaskDelete = (data: { taskId: string }) => {
    setLocalTasks(prev => 
      prev.filter(t => t.id !== data.taskId)
    );
  };
  
  const handleForceUpdate = () => {
    // Force reload from storage to ensure we have the latest data
    const storedTasks = taskStorage.loadTasks();
    console.log("TaskManager - Reloaded tasks from storage:", storedTasks);
    
    if (isTimerPage) {
      const timerTasks = storedTasks.filter(task => task.taskType === 'timer');
      console.log("TaskManager - Filtered timer tasks after reload:", timerTasks);
      setLocalTasks(timerTasks);
    } else {
      setLocalTasks(storedTasks);
    }
  };
  
  const handleTaskAdd = (task: Task) => {
    // In timer view, only add timer tasks
    if (isTimerPage && task.taskType !== 'timer') {
      return;
    }
    
    // Add to local state immediately for responsive UI
    setLocalTasks(prev => {
      if (prev.some(t => t.id === task.id)) return prev;
      return [...prev, task];
    });
  };

  const handleTasksAdd = (tasks: Task[]) => {
    // In timer view, only add timer tasks
    const tasksToAdd = isTimerPage 
      ? tasks.filter(task => task.taskType === 'timer')
      : tasks;
    
    if (tasksToAdd.length === 0) return;
    
    // Add to local state immediately for responsive UI
    setLocalTasks(prev => {
      // Filter out duplicates
      const newTasks = tasksToAdd.filter(task => !prev.some(t => t.id === task.id));
      return [...prev, ...newTasks];
    });
  };

  return (
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
  );
};

export default TaskManager;
