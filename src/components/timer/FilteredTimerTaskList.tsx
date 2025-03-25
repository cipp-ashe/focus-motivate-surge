import React, { useEffect, useState, useCallback } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';
import { TaskList } from '@/components/tasks/TaskList';
import { useTaskSelection } from './providers/TaskSelectionProvider';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { ClockIcon } from 'lucide-react';
import { logger } from '@/utils/logManager';
import { toast } from 'sonner';
import { TaskType } from '@/types/tasks';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-4 text-center">
    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted/20 mb-2">
      {icon}
    </div>
    <h3 className="font-medium text-base">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-[200px] mt-1">{description}</p>
  </div>
);

export const FilteredTimerTaskList = () => {
  const { items } = useTaskContext();
  const [timerTasks, setTimerTasks] = useState<Task[]>([]);
  const { selectedTask, selectTask } = useTaskSelection();
  const taskEvents = useTaskEvents();
  const [isLoading, setIsLoading] = useState(true);

  const filterTimerTasks = useCallback(() => {
    logger.debug('FilteredTimerTaskList', 'Filtering timer tasks from all tasks');

    const filteredTasks = items
      .filter((task) => !task.completed && task.taskType === 'timer')
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    logger.debug('FilteredTimerTaskList', `Found ${filteredTasks.length} timer tasks`);
    setTimerTasks(filteredTasks);
    setIsLoading(false);
  }, [items]);

  // Filter tasks specifically for timer view (timer tasks)
  useEffect(() => {
    filterTimerTasks();
  }, [filterTimerTasks]);

  // Listen for task creation events to immediately update the list
  useEffect(() => {
    const handleTaskCreate = (task: Task) => {
      if (task.taskType === 'timer') {
        logger.debug('FilteredTimerTaskList', `New timer task created: ${task.name}`);

        // Immediately add the new task to our filtered list
        setTimerTasks((prev) => [task, ...prev]);

        // Automatically select the new task
        selectTask(task);

        toast.success(`Timer task added: ${task.name}`);
      }
    };

    const unsubscribe = taskEvents.onTaskCreate(handleTaskCreate);
    return () => unsubscribe();
  }, [taskEvents, selectTask]);

  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    logger.debug('FilteredTimerTaskList', `Task selected: ${taskId}`);

    const task = timerTasks.find((t) => t.id === taskId);
    if (task) {
      selectTask(task);
    }
  };

  // Event handlers for timer tasks
  const handleTaskUpdate = (data: { taskId: string; updates: Partial<Task> }) => {
    logger.debug('FilteredTimerTaskList', `Task updated: ${data.taskId}`, data.updates);
    // TaskContext will handle the actual update
  };

  const handleTaskDelete = (data: { taskId: string }) => {
    logger.debug('FilteredTimerTaskList', `Task deleted: ${data.taskId}`);
    // Remove from local state immediately for better UX
    setTimerTasks((prev) => prev.filter((task) => task.id !== data.taskId));

    // If the deleted task was selected, clear the selection
    if (selectedTask?.id === data.taskId) {
      selectTask(null);
    }
  };

  const handleTaskComplete = (data: { taskId: string }) => {
    logger.debug('FilteredTimerTaskList', `Task completed: ${data.taskId}`);
    // Remove from local state immediately for better UX
    setTimerTasks((prev) => prev.filter((task) => task.id !== data.taskId));

    // If the completed task was selected, clear the selection
    if (selectedTask?.id === data.taskId) {
      selectTask(null);
    }
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-pulse flex flex-col space-y-3 w-full">
            <div className="h-12 bg-muted/20 rounded-lg w-full"></div>
            <div className="h-12 bg-muted/20 rounded-lg w-full"></div>
            <div className="h-12 bg-muted/20 rounded-lg w-full"></div>
          </div>
        </div>
      ) : timerTasks.length > 0 ? (
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
              icon={<ClockIcon className="h-8 w-8 text-muted-foreground" />}
              title="No timer tasks"
              description="Create a timer task to get started"
            />
          }
        />
      ) : (
        <EmptyState
          icon={<ClockIcon className="h-8 w-8 text-muted-foreground" />}
          title="No timer tasks"
          description="Create a timer task to get started"
        />
      )}
    </div>
  );
};
