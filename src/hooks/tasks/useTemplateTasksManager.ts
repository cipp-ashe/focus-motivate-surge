
import { useCallback, useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { Task } from '@/types/tasks';
import { useTaskEvents } from './useTaskEvents';

export const useTemplateTasksManager = (tasks: Task[]) => {
  const { deleteTask, forceTaskUpdate } = useTaskEvents();

  // Handle template deletion - clean up associated tasks
  const handleTemplateDelete = useCallback((event: { templateId: string, suppressToast?: boolean }) => {
    const { templateId, suppressToast } = event;
    console.log(`TemplateTasksManager: Received template deletion event for ${templateId}`);
    
    // Find all tasks related to this template
    const tasksToRemove = tasks.filter(task => 
      task.relationships?.templateId === templateId
    );
    
    if (tasksToRemove.length === 0) {
      console.log(`No tasks found for template ${templateId}`);
      return;
    }
    
    console.log(`Found ${tasksToRemove.length} tasks to remove for template ${templateId}`);
    
    // Delete each task associated with the deleted template
    tasksToRemove.forEach(task => {
      console.log(`Removing task ${task.id} associated with deleted template ${templateId}`);
      // Pass suppressToast parameter through to avoid duplicate toasts
      deleteTask(task.id, 'template-removed', suppressToast);
    });
    
    // Force a UI update after deleting tasks
    setTimeout(() => {
      console.log('TemplateTasksManager: Forcing task list update after template removal');
      forceTaskUpdate();
    }, 100);
  }, [tasks, deleteTask, forceTaskUpdate]);

  // Setup event listener for template deletion
  useEffect(() => {
    const unsubscribeTemplateDelete = eventBus.on('habit:template-delete', handleTemplateDelete);
    
    return () => {
      unsubscribeTemplateDelete();
    };
  }, [handleTemplateDelete]);

  return {
    deleteTasksByTemplate: handleTemplateDelete
  };
};
