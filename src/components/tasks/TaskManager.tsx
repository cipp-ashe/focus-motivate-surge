
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
  const { items, selected } = useTaskContext();
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
    if (taskContext && taskContext.completeTask) {
      taskContext.completeTask(taskId, metrics);
    }
  }, []);
  
  const handleForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* ActionBar would go here */}
      </div>
      
      <TaskList
        tasks={filteredTasks}
        selectedTaskId={selected}
        onTaskAction={handleAction}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
        onForceUpdate={handleForceUpdate}
        onTaskComplete={handleComplete}
        isLoading={loading}
        loadingCount={3}
        emptyState={<div>No tasks found. Create your first task!</div>}
        dialogOpeners={dialogOpeners}
        taskCountInfo={{
          total: items.length,
          completed: items.filter(t => t.completed).length
        }}
      />
      
      <TaskEventHandler
        onForceUpdate={handleForceUpdate}
        onTaskCreate={createTask}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
        onTaskComplete={handleComplete}
        tasks={filteredTasks}
      />
    </div>
  );
};
