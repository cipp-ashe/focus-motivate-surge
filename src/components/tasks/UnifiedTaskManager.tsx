
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from './TaskList';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UnifiedTaskManagerProps {
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

/**
 * UnifiedTaskManager component
 * 
 * This is an optimized version of TaskManager that uses our unified hooks
 */
export const UnifiedTaskManager: React.FC<UnifiedTaskManagerProps> = ({
  initialFilter = 'all',
  initialTag = null,
  hasTasks = false,
  dialogOpeners
}) => {
  const { items, selected, completeTask } = useTaskContext();
  const [loading, setLoading] = useState(false);
  
  // Use our unified task manager hook
  const taskManager = useUnifiedTaskManager();
  
  // Task counts
  const taskCounts = {
    total: items.length,
    completed: items.filter(t => t.completed).length
  };

  // Task event handlers
  const handleTaskSelect = useCallback((taskId: string) => {
    taskManager.selectTask(taskId);
  }, [taskManager]);
  
  const handleTaskDelete = useCallback((data: { taskId: string }) => {
    taskManager.deleteTask(data.taskId);
  }, [taskManager]);

  const handleTaskUpdate = useCallback((data: { taskId: string; updates: Partial<Task> }) => {
    taskManager.updateTask(data.taskId, data.updates);
  }, [taskManager]);

  const handleTaskComplete = useCallback((data: { taskId: string; metrics?: any }) => {
    taskManager.completeTask(data.taskId, data.metrics);
  }, [taskManager]);

  const handleForceUpdate = useCallback(() => {
    taskManager.forceTaskUpdate();
  }, [taskManager]);

  // Dialog opener handlers
  const handleShowImage = useCallback((imageUrl: string, taskName: string) => {
    if (dialogOpeners?.screenshot) {
      dialogOpeners.screenshot(imageUrl, taskName);
    }
  }, [dialogOpeners]);

  const handleOpenChecklist = useCallback((taskId: string, taskName: string, items: any[]) => {
    if (dialogOpeners?.checklist) {
      dialogOpeners.checklist(taskId, taskName, items);
    }
  }, [dialogOpeners]);

  const handleOpenJournal = useCallback((taskId: string, taskName: string, entry: string) => {
    if (dialogOpeners?.journal) {
      dialogOpeners.journal(taskId, taskName, entry);
    }
  }, [dialogOpeners]);

  const handleOpenVoiceRecorder = useCallback((taskId: string, taskName: string) => {
    if (dialogOpeners?.voicenote) {
      dialogOpeners.voicenote(taskId, taskName);
    }
  }, [dialogOpeners]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* ActionBar would go here */}
      </div>
      
      <TaskList
        tasks={items}
        selectedTaskId={selected}
        handleTaskSelect={handleTaskSelect}
        handleDelete={handleTaskDelete}
        handleTaskUpdate={handleTaskUpdate}
        onForceUpdate={handleForceUpdate}
        handleTaskComplete={handleTaskComplete}
        isLoading={loading}
        loadingCount={3}
        emptyState={<div>No tasks found. Create your first task!</div>}
        dialogOpeners={dialogOpeners || {
          checklist: undefined,
          journal: undefined,
          screenshot: undefined,
          voicenote: undefined
        }}
        taskCountInfo={taskCounts}
      />
      
      {/* Instead of including separate listeners here, we're using the unified task manager */}
    </div>
  );
};
