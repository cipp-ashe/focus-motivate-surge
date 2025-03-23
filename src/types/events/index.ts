
// A unified events type file to simplify imports and resolve conflicts

// Re-export all types from the main events file
export * from '../events';

// Define AllEventTypes type to resolve the conflicts
export type AllEventTypes = string;

// Export event handler type
export type EventHandler<T = any> = (payload: T) => void;
