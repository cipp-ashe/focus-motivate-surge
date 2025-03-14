
import { useEffect } from 'react';
import { logger } from '@/utils/logManager';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Hook to enable debug mode with console helpers
 */
export const useDebugMode = (enabled: boolean = false) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    // Store existing functions to avoid overwriting them
    const existingFunctions = {
      enableLogs: (window as any).enableLogs,
      disableLogs: (window as any).disableLogs,
      monitorEvents: (window as any).monitorEvents,
      printListenerCounts: (window as any).printListenerCounts,
    };
    
    // Set up debugging utilities on window
    (window as any).enableLogs = () => {
      logger.setLogLevel(logger.LOG_LEVELS.DEBUG);
      logger.setEventLogging(true);
      console.log('Debug logging enabled. Use disableLogs() to turn off.');
    };
    
    (window as any).disableLogs = () => {
      logger.setLogLevel(logger.LOG_LEVELS.INFO);
      logger.setEventLogging(false);
      console.log('Debug logging disabled.');
    };

    (window as any).monitorEvents = (eventsToMonitor?: string[]) => {
      logger.setEventLogging(true);
      
      if (eventsToMonitor && eventsToMonitor.length > 0) {
        console.log(`Monitoring specific events: ${eventsToMonitor.join(', ')}`);
        
        // Add filters for specific events if needed
        eventsToMonitor.forEach(event => {
          logger.addModuleFilter(event);
        });
      } else {
        logger.clearModuleFilters();
        console.log('Monitoring all events. For specific events, pass an array of event names.');
      }
    };
    
    (window as any).printListenerCounts = () => {
      const counts = eventManager.getListenerCounts();
      console.log('Event listener counts:', counts);
      
      // Print in a formatted way for better readability
      console.group('Event Listener Counts');
      
      Object.entries(counts)
        .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
        .forEach(([event, count]) => {
          console.log(`${event}: ${count} listeners`);
        });
      
      console.groupEnd();
    };
    
    // Enable debug mode by default for development
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Debug', 'Debug mode available. Use enableLogs(), disableLogs(), monitorEvents(), printListenerCounts() in console.');
    }
    
    // Cleanup
    return () => {
      // Restore previous functions if they existed
      if (existingFunctions.enableLogs) (window as any).enableLogs = existingFunctions.enableLogs;
      if (existingFunctions.disableLogs) (window as any).disableLogs = existingFunctions.disableLogs;
      if (existingFunctions.monitorEvents) (window as any).monitorEvents = existingFunctions.monitorEvents;
      if (existingFunctions.printListenerCounts) (window as any).printListenerCounts = existingFunctions.printListenerCounts;
    };
  }, [enabled]);
};

// Export a one-line version that enables debug mode in development
export const initDebugMode = () => useDebugMode(process.env.NODE_ENV !== 'production');
