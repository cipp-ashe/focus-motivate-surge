
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Task } from '@/types/tasks';
import { TaskList } from './TaskList';
import { UnifiedTaskEventListener } from './event-handlers/UnifiedTaskEventListener';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useUnifiedTaskEvents } from '@/hooks/tasks/useUnifiedTaskEvents';
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
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Use our unified task events hook
  const taskEvents = useUnifiedTaskEvents();
  
  // Task Filtering - simplified without the missing hooks
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  // Initialize filtered tasks with all tasks
  useEffect(() => {
    setFilteredTasks(items);
  }, [items]);

  const handleTaskSelect = useCallback((taskId: string) => {
    console.log(`TaskManager: Selecting task ${taskId}`);
    taskEvents.selectTask(taskId);
  }, [taskEvents]);
  
  const handleForceUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Task update handler
  const handleTaskUpdate = useCallback((data: { taskId: string; updates: Partial<Task> }) => {
    console.log('TaskManager: Handling task update', data);
    taskEvents.updateTask(data.taskId, data.updates);
  }, [taskEvents]);

  // Task delete handler
  const handleTaskDelete = useCallback((data: { taskId: string }) => {
    console.log('TaskManager: Handling task delete', data);
    taskEvents.deleteTask(data.taskId);
  }, [taskEvents]);

  // Task complete handler
  const handleTaskComplete = useCallback((data: { taskId: string; metrics?: any }) => {
    console.log('TaskManager: Handling task complete', data);
    taskEvents.completeTask(data.taskId, data.metrics);
  }, [taskEvents]);

  // Calculate task counts
  const taskCounts = {
    total: items.length,
    completed: items.filter(t => t.completed).length
  };

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
        tasks={filteredTasks}
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
      
      <UnifiedTaskEventListener
        onTaskUpdate={handleTaskUpdate}
        onShowImage={handleShowImage}
        onOpenChecklist={handleOpenChecklist}
        onOpenJournal={handleOpenJournal}
        onOpenVoiceRecorder={handleOpenVoiceRecorder}
      />
    </div>
  );
};
