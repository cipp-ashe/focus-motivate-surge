
import React, { useEffect, useState } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { TaskList } from '@/components/tasks/TaskList';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { EmptyState } from '@/components/ui/empty-state';
import { ClockIcon } from 'lucide-react';
import { logger } from '@/utils/logManager';

export const FilteredTimerTaskList = () => {
  const { items } = useTaskContext();
  const [timerTasks, setTimerTasks] = useState<Task[]>([]);
  const { selectedTask, selectTask } = useTaskSelection();
  const taskEvents = useTaskEvents();
  
  // Filter tasks specifically for timer view (timer tasks)
  useEffect(() => {
    logger.debug('FilteredTimerTaskList', 'Filtering timer tasks from all tasks');
    
    const filteredTasks = items
      .filter(task => !task.completed && (task.taskType === 'timer' || task.taskType === 'focus'))
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    logger.debug('FilteredTimerTaskList', `Found ${filteredTasks.length} timer tasks`);
    setTimerTasks(filteredTasks);
  }, [items]);
  
  // Listen for task creation events to immediately update the list
  useEffect(() => {
    const handleTaskCreate = (task: Task) => {
      if (task.taskType === 'timer' || task.taskType === 'focus') {
        logger.debug('FilteredTimerTaskList', `New timer task created: ${task.name}`);
        
        // Immediately add the new task to our filtered list
        setTimerTasks(prev => [task, ...prev]);
      }
    };
    
    const unsubscribe = taskEvents.onTaskCreate(handleTaskCreate);
    return () => unsubscribe();
  }, [taskEvents]);
  
  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    logger.debug('FilteredTimerTaskList', `Task selected: ${taskId}`);
    
    const task = timerTasks.find(t => t.id === taskId);
    if (task) {
      selectTask(task);
    }
  };
  
  // Event handlers for timer tasks
  const handleTaskUpdate = (data: { taskId: string, updates: Partial<Task> }) => {
    logger.debug('FilteredTimerTaskList', `Task updated: ${data.taskId}`, data.updates);
    // TaskContext will handle the actual update
  };
  
  const handleTaskDelete = (data: { taskId: string }) => {
    logger.debug('FilteredTimerTaskList', `Task deleted: ${data.taskId}`);
    // Remove from local state immediately for better UX
    setTimerTasks(prev => prev.filter(task => task.id !== data.taskId));
  };
  
  const handleTaskComplete = (data: { taskId: string }) => {
    logger.debug('FilteredTimerTaskList', `Task completed: ${data.taskId}`);
    // Remove from local state immediately for better UX
    setTimerTasks(prev => prev.filter(task => task.id !== data.taskId));
  };

  return (
    <div className="space-y-2">
      {timerTasks.length > 0 ? (
        <TaskList
          tasks={timerTasks}
          selectedTaskId={selectedTask?.id}
          handleTaskSelect={handleTaskSelect}
          handleTaskUpdate={handleTaskUpdate}
          handleDelete={handleTaskDelete}
          handleTaskComplete={handleTaskComplete}
          isTimerView={true}
          emptyState={
            <EmptyState
              icon={<ClockIcon className="h-10 w-10 text-muted-foreground" />}
              title="No timer tasks"
              description="Create a timer task to get started"
            />
          }
        />
      ) : (
        <EmptyState
          icon={<ClockIcon className="h-10 w-10 text-muted-foreground" />}
          title="No timer tasks"
          description="Create a timer task to get started"
        />
      )}
    </div>
  );
};
