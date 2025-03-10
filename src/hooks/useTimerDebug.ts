
import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

/**
 * Hook for monitoring timer-related events for debugging purposes
 */
export const useTimerDebug = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;
    
    // Setup debug event listeners
    const unsubs = [
      // Task events
      eventBus.on('task:select' as any, (taskId) => {
        console.log('🔍 DEBUG: task:select event:', taskId);
        toast('Task selected', { 
          description: `ID: ${taskId}`,
          icon: '🔍'
        });
      }),
      
      eventBus.on('task:update' as any, (data) => {
        console.log('🔍 DEBUG: task:update event:', data);
      }),
      
      // Timer events
      eventBus.on('timer:set-task' as any, (task) => {
        console.log('🔍 DEBUG: timer:set-task event:', task);
        toast('Timer task set', {
          description: `Task: ${task.name}`,
          icon: '⏲️'
        });
      }),
      
      eventBus.on('timer:start' as any, (data) => {
        console.log('🔍 DEBUG: timer:start event:', data);
      }),
      
      eventBus.on('timer:pause' as any, (data) => {
        console.log('🔍 DEBUG: timer:pause event:', data);
      }),
      
      eventBus.on('timer:complete' as any, (data) => {
        console.log('🔍 DEBUG: timer:complete event:', data);
      }),
      
      // Force update events
      eventBus.on('task:reload' as any, () => {
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
