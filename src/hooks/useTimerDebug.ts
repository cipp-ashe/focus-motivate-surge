
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for monitoring timer-related events for debugging purposes
 */
export const useTimerDebug = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;
    
    // Setup debug event listeners
    const unsubs = [
      // Task events
      eventBus.on('task:select', (taskId) => {
        console.log('🔍 DEBUG: task:select event:', taskId);
        toast.info(`Task selected: ${taskId}`);
      }),
      
      eventBus.on('task:update', (data) => {
        console.log('🔍 DEBUG: task:update event:', data);
      }),
      
      // Timer events
      eventBus.on('timer:set-task', (task) => {
        console.log('🔍 DEBUG: timer:set-task event:', task);
        toast.info(`Timer task set: ${task.name}`);
      }),
      
      eventBus.on('timer:start', (data) => {
        console.log('🔍 DEBUG: timer:start event:', data);
      }),
      
      eventBus.on('timer:pause', (data) => {
        console.log('🔍 DEBUG: timer:pause event:', data);
      }),
      
      eventBus.on('timer:complete', (data) => {
        console.log('🔍 DEBUG: timer:complete event:', data);
      }),
      
      // Force update events
      eventBus.on('task:reload', () => {
        console.log('🔍 DEBUG: task:reload event received');
      })
    ];
    
    // DOM event listeners
    const handleForceUpdate = () => {
      console.log('🔍 DEBUG: force-task-update event received');
    };
    
    const handleTimerSetTask = (e: CustomEvent) => {
      console.log('🔍 DEBUG: timer:set-task DOM event:', e.detail);
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    window.addEventListener('timer:set-task', handleTimerSetTask as EventListener);
    
    return () => {
      // Clean up all event listeners
      unsubs.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
      window.removeEventListener('timer:set-task', handleTimerSetTask as EventListener);
    };
  }, [enabled]);
};
