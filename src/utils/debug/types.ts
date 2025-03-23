
/**
 * Common types and constants for the debug system
 */

/** Flag to determine if we're in development mode */
export const IS_DEV = process.env.NODE_ENV === 'development';

/** Debug module types for categorizing logs */
export type DebugModule = 
  | 'app' 
  | 'auth'
  | 'ui'
  | 'data'
  | 'timer'
  | 'tasks'
  | 'habits'
  | 'notes'
  | 'examples';

/** Debug level to determine verbosity */
export type DebugLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

// Configuration for the debug system
export const DEBUG_CONFIG = {
  enabled: IS_DEV,
  defaultLevel: 'info' as DebugLevel,
  defaultModules: ['app', 'ui', 'data'] as DebugModule[],
  captureConsoleErrors: true,
  captureGlobalErrors: true,
  TRACE_DATA_FLOW: IS_DEV,
};

// Debug event interface
export interface DebugEvent {
  type: string;
  module: DebugModule;
  component: string;
  message: string;
  timestamp: number;
  data?: any;
}

// Simple debug store for event logging
export const debugStore = {
  events: [] as DebugEvent[],
  addEvent: (event: DebugEvent) => {
    debugStore.events.push(event);
    // Limit size to prevent memory issues
    if (debugStore.events.length > 1000) {
      debugStore.events.shift();
    }
  },
  getEvents: () => debugStore.events,
  clear: () => {
    debugStore.events = [];
  }
};
