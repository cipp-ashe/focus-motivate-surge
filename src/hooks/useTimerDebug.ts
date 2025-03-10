import { useEffect } from 'react';
import { eventBus } from '@/lib/eventBus';
import { toast } from 'sonner';

/**
 * Hook for monitoring timer-related events for debugging purposes
 */
export const useTimerDebug = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled) return;
    
    let isSubscribed = true;
    const consoleDebounce = new Set<string>();
    
    // Setup debug event listeners
    const unsubs = [
      // Task events
      eventBus.on('task:select' as any, (taskId) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has(`select-${taskId}`)) {
          console.log('🔍 DEBUG: task:select event:', taskId);
          toast('Task selected', { 
            description: `ID: ${taskId}`,
            icon: '🔍'
          });
          consoleDebounce.add(`select-${taskId}`);
          setTimeout(() => consoleDebounce.delete(`select-${taskId}`), 1000);
        }
      }),
      
      eventBus.on('task:update' as any, (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has(`update-${data.taskId}`)) {
          console.log('🔍 DEBUG: task:update event:', data);
          consoleDebounce.add(`update-${data.taskId}`);
          setTimeout(() => consoleDebounce.delete(`update-${data.taskId}`), 1000);
        }
      }),
      
      // Timer events
      eventBus.on('timer:set-task' as any, (task) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has(`set-task-${task.id}`)) {
          console.log('🔍 DEBUG: timer:set-task event:', task);
          toast('Timer task set', {
            description: `Task: ${task.name}`,
            icon: '⏲️'
          });
          consoleDebounce.add(`set-task-${task.id}`);
          setTimeout(() => consoleDebounce.delete(`set-task-${task.id}`), 1000);
        }
      }),
      
      eventBus.on('timer:start' as any, (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('timer-start')) {
          console.log('🔍 DEBUG: timer:start event:', data);
          consoleDebounce.add('timer-start');
          setTimeout(() => consoleDebounce.delete('timer-start'), 1000);
        }
      }),
      
      eventBus.on('timer:pause' as any, (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('timer-pause')) {
          console.log('🔍 DEBUG: timer:pause event:', data);
          consoleDebounce.add('timer-pause');
          setTimeout(() => consoleDebounce.delete('timer-pause'), 1000);
        }
      }),
      
      eventBus.on('timer:complete' as any, (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('timer-complete')) {
          console.log('🔍 DEBUG: timer:complete event:', data);
          consoleDebounce.add('timer-complete');
          setTimeout(() => consoleDebounce.delete('timer-complete'), 1000);
        }
      }),
      
      // Force update events
      eventBus.on('task:reload' as any, () => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('task-reload')) {
          console.log('🔍 DEBUG: task:reload event received');
          consoleDebounce.add('task-reload');
          setTimeout(() => consoleDebounce.delete('task-reload'), 1000);
        }
      })
    ];
    
    // DOM event listeners with debouncing
    const handleForceUpdate = () => {
      if (!isSubscribed) return;
      if (!consoleDebounce.has('force-update')) {
        console.log('🔍 DEBUG: force-task-update event received');
        consoleDebounce.add('force-update');
        setTimeout(() => consoleDebounce.delete('force-update'), 1000);
      }
    };
    
    const handleTimerSetTask = (e: CustomEvent) => {
      if (!isSubscribed) return;
      if (!consoleDebounce.has('timer-set-task')) {
        console.log('🔍 DEBUG: timer:set-task DOM event:', e.detail);
        consoleDebounce.add('timer-set-task');
        setTimeout(() => consoleDebounce.delete('timer-set-task'), 1000);
      }
    };
    
    window.addEventListener('force-task-update', handleForceUpdate);
    window.addEventListener('timer:set-task', handleTimerSetTask as EventListener);
    
    return () => {
      isSubscribed = false;
      unsubs.forEach(unsub => unsub());
      window.removeEventListener('force-task-update', handleForceUpdate);
      window.removeEventListener('timer:set-task', handleTimerSetTask as EventListener);
      consoleDebounce.clear();
    };
  }, [enabled]);
};
