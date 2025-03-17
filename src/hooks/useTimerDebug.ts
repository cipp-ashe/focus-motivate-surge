
import { useEffect } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { logger } from '@/utils/logManager';

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
      eventManager.on('task:select', (taskId) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has(`select-${taskId}`)) {
          logger.debug('TimerDebug', '🔍 DEBUG: task:select event:', taskId);
          toast('Task selected', { 
            description: `ID: ${taskId}`,
            icon: '🔍'
          });
          consoleDebounce.add(`select-${taskId}`);
          setTimeout(() => consoleDebounce.delete(`select-${taskId}`), 1000);
        }
      }),
      
      eventManager.on('task:update', (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has(`update-${data.taskId}`)) {
          logger.debug('TimerDebug', '🔍 DEBUG: task:update event:', data);
          consoleDebounce.add(`update-${data.taskId}`);
          setTimeout(() => consoleDebounce.delete(`update-${data.taskId}`), 1000);
        }
      }),
      
      // Timer events
      eventManager.on('timer:set-task', (task) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has(`set-task-${task.id}`)) {
          logger.debug('TimerDebug', '🔍 DEBUG: timer:set-task event:', task);
          toast('Timer task set', {
            description: `Task: ${task.name}`,
            icon: '⏲️'
          });
          consoleDebounce.add(`set-task-${task.id}`);
          setTimeout(() => consoleDebounce.delete(`set-task-${task.id}`), 1000);
        }
      }),
      
      eventManager.on('timer:start', (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('timer-start')) {
          logger.debug('TimerDebug', '🔍 DEBUG: timer:start event:', data);
          consoleDebounce.add('timer-start');
          setTimeout(() => consoleDebounce.delete('timer-start'), 1000);
        }
      }),
      
      eventManager.on('timer:pause', (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('timer-pause')) {
          logger.debug('TimerDebug', '🔍 DEBUG: timer:pause event:', data);
          consoleDebounce.add('timer-pause');
          setTimeout(() => consoleDebounce.delete('timer-pause'), 1000);
        }
      }),
      
      eventManager.on('timer:complete', (data) => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('timer-complete')) {
          logger.debug('TimerDebug', '🔍 DEBUG: timer:complete event:', data);
          consoleDebounce.add('timer-complete');
          setTimeout(() => consoleDebounce.delete('timer-complete'), 1000);
        }
      }),
      
      // Force update events
      eventManager.on('task:reload', () => {
        if (!isSubscribed) return;
        if (!consoleDebounce.has('task-reload')) {
          logger.debug('TimerDebug', '🔍 DEBUG: task:reload event received');
          consoleDebounce.add('task-reload');
          setTimeout(() => consoleDebounce.delete('task-reload'), 1000);
        }
      })
    ];
    
    // DOM event listeners with debouncing
    const handleForceUpdate = () => {
      if (!isSubscribed) return;
      if (!consoleDebounce.has('force-update')) {
        logger.debug('TimerDebug', '🔍 DEBUG: force-task-update event received');
        consoleDebounce.add('force-update');
        setTimeout(() => consoleDebounce.delete('force-update'), 1000);
      }
    };
    
    const handleTimerSetTask = (e: CustomEvent) => {
      if (!isSubscribed) return;
      if (!consoleDebounce.has('timer-set-task')) {
        logger.debug('TimerDebug', '🔍 DEBUG: timer:set-task DOM event:', e.detail);
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
