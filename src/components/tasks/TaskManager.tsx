import React, { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { TaskStats } from './TaskStats';
import { TaskFilters } from './TaskFilters';
import { TaskActionsBar } from './TaskActionsBar';
import { TaskEmptyState } from './TaskEmptyState';
import { TaskEventHandler } from './TaskEventHandler';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { useTaskActions } from '@/hooks/tasks/useTaskActions';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { useTasksNavigation } from '@/hooks/tasks/useTasksNavigation';
import { useTasksTasks } from '@/hooks/tasks/useTasksTasks';
import { useTaskFilter } from '@/hooks/tasks/useTaskFilter';
import { useTaskSearch } from '@/hooks/tasks/useTaskSearch';
import { useTaskSort } from '@/hooks/tasks/useTaskSort';
import { useTaskCompletion } from '@/hooks/tasks/useTaskCompletion';
import { useTaskDeletion } from '@/hooks/tasks/useTaskDeletion';
import { useTaskCreation } from '@/hooks/tasks/useTaskCreation';
import { useTaskUpdate } from '@/hooks/tasks/useTaskUpdate';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskManagerProps {
  initialFilter?: 'all' | 'today' | 'week' | 'tag';
  initialTag?: string | null;
  hasTasks?: boolean;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  initialFilter = 'all',
  initialTag = null,
  hasTasks = false
}) => {
  const { items } = useTaskContext();
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Task Actions
  const { handleComplete } = useTaskCompletion();
  const { handleTaskDelete } = useTaskDeletion();
  const { handleTaskCreate } = useTaskCreation();
  const { handleTaskUpdate } = useTaskUpdate();
  
  // Task Events
  const { forceTaskUpdate } = useTaskEvents();
  
  // Task Navigation
  const { handleTaskSelect } = useTasksNavigation();
  
  // Task Filtering
  const { filter, setFilter, filteredTasks, taskCountInfo } = useTaskFilter(initialFilter, initialTag);
  
  // Task Search
  const { searchTerm, setSearchTerm, searchedTasks } = useTaskSearch(filteredTasks);
  
  // Task Sorting
  const { sortOrder, setSortOrder, sortedTasks } = useTaskSort(searchedTasks);
  
  const handleAction = useCallback((action: string, taskId: string) => {
    console.log(`TaskManager: Handling action ${action} for task ${taskId}`);
    
    // Handle task selection
    handleTaskSelect(taskId);
  }, [handleTaskSelect]);
  
  const dialogOptions = {
    checklist: undefined, // Make these all explicitly undefined instead of optional
    journal: undefined,
    screenshot: undefined,
    voicenote: undefined
  };

  const handleForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 flex items-center justify-between">
        <TaskActionsBar
          selectedTasks={selectedTasks}
          onTasksDelete={() => {
            selectedTasks.forEach(handleTaskDelete);
            setSelectedTasks([]);
          }}
          onTasksComplete={() => {
            selectedTasks.forEach(handleComplete);
            setSelectedTasks([]);
          }}
          hasTasks={hasTasks}
        />
      </div>
      
      <TaskList
        tasks={sortedTasks}
        onTaskAction={handleAction}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onForceUpdate={handleForceUpdate}
        onTaskComplete={handleComplete}
        isLoading={loading}
        loadingCount={3}
        emptyState={<TaskEmptyState />}
        dialogOpeners={dialogOptions}
        taskCountInfo={taskCountInfo}
      />
      
      <TaskEventHandler
        onForceUpdate={handleForceUpdate}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskComplete={handleComplete}
        tasks={sortedTasks}
      />
    </div>
  );
};
