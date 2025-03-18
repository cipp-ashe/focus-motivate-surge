
import React, { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from './TaskList';
import { TaskEventHandler } from './TaskEventHandler';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { useTaskManager } from '@/hooks/tasks/useTaskManager';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { useTasksNavigation } from '@/hooks/tasks/useTasksNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskManagerProps {
  initialFilter?: 'all' | 'today' | 'week' | 'tag';
  initialTag?: string | null;
  hasTasks?: boolean;
  dialogOpeners?: {
    checklist?: (taskId: string, taskName: string, items: any[]) => void;
    journal?: (taskId: string, taskName: string, entry: string) => void;
    screenshot?: (imageUrl: string, taskName: string) => void;
    voicenote?: (taskId: string, taskName: string) => void;
  };
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  initialFilter = 'all',
  initialTag = null,
  hasTasks = false,
  dialogOpeners
}) => {
  const { items, selected, completeTask } = useTaskContext();
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Task Actions
  const { createTask, updateTask, deleteTask } = useTaskManager();
  
  // Task Events
  const { forceTaskUpdate } = useTaskEvents();
  
  // Task Navigation
  const { navigateToTask } = useTasksNavigation();
  
  // Task Filtering & Sorting - simplified without the missing hooks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  // Initialize filtered tasks with all tasks
  useEffect(() => {
    setFilteredTasks(items);
  }, [items]);

  const handleTaskSelect = useCallback((taskId: string) => {
    console.log(`TaskManager: Selecting task ${taskId}`);
    navigateToTask(taskId);
  }, [navigateToTask]);
  
  const handleAction = useCallback((action: string, taskId: string) => {
    console.log(`TaskManager: Handling action ${action} for task ${taskId}`);
    
    // Handle task selection
    if (action === 'select') {
      handleTaskSelect(taskId);
    }
  }, [handleTaskSelect]);
  
  const handleComplete = useCallback((taskId: string, metrics?: any) => {
    console.log(`TaskManager: Completing task ${taskId}`);
    if (completeTask) {
      completeTask(taskId, metrics);
    }
  }, [completeTask]);
  
  const handleForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  // Wrapper functions to adapt to the expected parameter format for event handlers
  const handleTaskUpdateWrapper = (data: { taskId: string; updates: Partial<Task> }) => {
    console.log('TaskManager: Handling task update wrapper', data);
    if (updateTask) {
      updateTask(data.taskId, data.updates);
    }
  };

  const handleTaskDeleteWrapper = (data: { taskId: string }) => {
    console.log('TaskManager: Handling task delete wrapper', data);
    if (deleteTask) {
      deleteTask(data.taskId);
    }
  };

  const handleTaskCompleteWrapper = (data: { taskId: string; metrics?: any }) => {
    console.log('TaskManager: Handling task complete wrapper', data);
    if (completeTask) {
      completeTask(data.taskId, data.metrics);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* ActionBar would go here */}
      </div>
      
      <TaskList
        tasks={filteredTasks}
        selectedTaskId={selected}
        handleTaskSelect={handleTaskSelect}
        handleDelete={handleTaskDeleteWrapper}
        handleTaskUpdate={handleTaskUpdateWrapper}
        onForceUpdate={handleForceUpdate}
        handleTaskComplete={handleTaskCompleteWrapper}
        isLoading={loading}
        loadingCount={3}
        emptyState={<div>No tasks found. Create your first task!</div>}
        dialogOpeners={dialogOpeners || {
          checklist: undefined,
          journal: undefined,
          screenshot: undefined,
          voicenote: undefined
        }}
        taskCountInfo={{
          total: items.length,
          completed: items.filter(t => t.completed).length
        }}
      />
      
      <TaskEventHandler
        onForceUpdate={handleForceUpdate}
        onTaskCreate={createTask}
        onTaskUpdate={handleTaskUpdateWrapper}
        onTaskDelete={handleTaskDeleteWrapper}
        onTaskComplete={handleTaskCompleteWrapper}
        tasks={filteredTasks}
      />
    </div>
  );
};
