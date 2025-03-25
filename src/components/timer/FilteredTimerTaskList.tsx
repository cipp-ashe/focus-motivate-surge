
import React, { useEffect, useMemo, useState } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { useTaskSelection } from '@/components/timer/providers/TaskSelectionProvider';
import { Task } from '@/types/tasks';
import { logger } from '@/utils/logManager';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';

export const FilteredTimerTaskList = () => {
  const { tasks, completeTask, updateTask, deleteTask } = useTasks();
  const { selectedTask, selectTask, clearSelectedTask } = useTaskSelection();
  const taskEvents = useTaskEvents();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Listen for task creation events to trigger a refresh
  useEffect(() => {
    const handleTaskCreate = (task: Task) => {
      if (task.taskType === 'timer') {
        logger.debug('FilteredTimerTaskList', 'New timer task created, refreshing list:', task.name);
        // Trigger a refresh of the list
        setRefreshTrigger(prev => prev + 1);
      }
    };
    
    // Subscribe to task creation events
    const unsubscribe = taskEvents.onTaskCreate(handleTaskCreate);
    
    return () => {
      unsubscribe();
    };
  }, [taskEvents]);
  
  // Filter tasks to only show timer tasks
  const timerTasks = useMemo(() => {
    logger.debug('FilteredTimerTaskList', `Filtering tasks: ${tasks.length} total tasks, refresh trigger: ${refreshTrigger}`);
    return tasks.filter(task => task.taskType === 'timer' && !task.completed);
  }, [tasks, refreshTrigger]);
  
  logger.debug('FilteredTimerTaskList', `Rendering ${timerTasks.length} timer tasks`);
  
  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    logger.debug('FilteredTimerTaskList', 'Task selected:', taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      selectTask(task);
    }
  };
  
  // Handle task deletion
  const handleDelete = (data: { taskId: string }) => {
    logger.debug('FilteredTimerTaskList', 'Deleting task:', data.taskId);
    
    // If the deleted task is currently selected, clear the selection
    if (selectedTask && selectedTask.id === data.taskId) {
      clearSelectedTask();
    }
    
    deleteTask(data.taskId);
  };
  
  // Handle task update
  const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
    logger.debug('FilteredTimerTaskList', 'Updating task:', data.taskId, data.updates);
    updateTask(data.taskId, data.updates);
  };
  
  // Handle task completion
  const handleTaskComplete = (data: { taskId: string, metrics?: any }) => {
    logger.debug('FilteredTimerTaskList', 'Completing task:', data.taskId);
    
    // If the completed task is currently selected, clear the selection
    if (selectedTask && selectedTask.id === data.taskId) {
      clearSelectedTask();
    }
    
    completeTask(data.taskId, data.metrics);
  };
  
  return (
    <TaskList
      tasks={timerTasks}
      selectedTaskId={selectedTask?.id || null}
      handleTaskSelect={handleTaskSelect}
      handleDelete={handleDelete}
      handleTaskUpdate={handleTaskUpdate}
      handleTaskComplete={handleTaskComplete}
      isTimerView={true}
      emptyState={
        <div className="py-8 text-center">
          <p className="text-lg font-medium mb-2">No timer tasks</p>
          <p className="text-sm text-muted-foreground">Create a new timer task to get started</p>
        </div>
      }
    />
  );
};
