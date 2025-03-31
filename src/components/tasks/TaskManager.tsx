
import React, { useState, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from './TaskList';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { TaskEventHandler } from './TaskEventHandler';
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

/**
 * TaskManager component
 * 
 * Consolidated from previous TaskManager and UnifiedTaskManager components
 */
export const TaskManager: React.FC<TaskManagerProps> = ({
  initialFilter = 'all',
  initialTag = null,
  hasTasks = false,
  dialogOpeners
}) => {
  const { items, selected, completeTask } = useTaskContext();
  const [loading, setLoading] = useState(false);
  
  // Use our consolidated task events hook
  const taskEvents = useTaskEvents();
  
  // Task counts
  const taskCounts = {
    total: items.length,
    completed: items.filter(t => t.completed).length
  };

  // Task event handlers
  const handleTaskSelect = useCallback((taskId: string) => {
    taskEvents.selectTask(taskId);
  }, [taskEvents]);
  
  const handleTaskDelete = useCallback((data: { taskId: string }) => {
    taskEvents.deleteTask(data.taskId);
  }, [taskEvents]);

  const handleTaskUpdate = useCallback((data: { taskId: string; updates: Partial<Task> }) => {
    taskEvents.updateTask(data.taskId, data.updates);
  }, [taskEvents]);

  const handleTaskComplete = useCallback((data: { taskId: string; metrics?: any }) => {
    taskEvents.completeTask(data.taskId, data.metrics);
  }, [taskEvents]);

  const handleForceUpdate = useCallback(() => {
    taskEvents.forceTaskUpdate();
  }, [taskEvents]);

  // Dialog opener handlers
  const handleShowImage = useCallback((imageUrl: string, taskName: string) => {
    if (dialogOpeners?.screenshot) {
      dialogOpeners.screenshot(imageUrl, taskName);
    } else {
      taskEvents.showTaskImage(imageUrl, taskName);
    }
  }, [dialogOpeners, taskEvents]);

  const handleOpenChecklist = useCallback((taskId: string, taskName: string, items: any[]) => {
    if (dialogOpeners?.checklist) {
      dialogOpeners.checklist(taskId, taskName, items);
    } else {
      taskEvents.openTaskChecklist(taskId, taskName, items);
    }
  }, [dialogOpeners, taskEvents]);

  const handleOpenJournal = useCallback((taskId: string, taskName: string, entry: string) => {
    if (dialogOpeners?.journal) {
      dialogOpeners.journal(taskId, taskName, entry);
    } else {
      taskEvents.openTaskJournal(taskId, taskName, entry);
    }
  }, [dialogOpeners, taskEvents]);

  const handleOpenVoiceRecorder = useCallback((taskId: string, taskName: string) => {
    if (dialogOpeners?.voicenote) {
      dialogOpeners.voicenote(taskId, taskName);
    } else {
      taskEvents.openTaskVoiceRecorder(taskId, taskName);
    }
  }, [dialogOpeners, taskEvents]);

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
      
      <TaskEventHandler
        onForceUpdate={handleForceUpdate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onTaskComplete={handleTaskComplete}
        tasks={items}
      />
    </div>
  );
};

// Export a renamed alias for backward compatibility
export const UnifiedTaskManager = TaskManager;
