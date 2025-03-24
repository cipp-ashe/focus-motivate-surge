
/**
 * Core event system types and utilities
 */

// Type for event unsubscribe function
export type EventUnsubscribe = () => void;

// Generic event callback interface
export interface BaseEventCallback<T = any> {
  (payload: T): void;
}

// Base event payload interface
export interface BaseEventPayload {
  [key: string]: any;
}
