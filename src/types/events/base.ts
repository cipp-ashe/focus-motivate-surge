
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

// General purpose event handler interface
export interface EventHandler<T = any> {
  (payload: T): void;
}

// Core event dispatcher interface
export interface EventDispatcher {
  emit<E extends string>(event: E, payload?: any): void;
  on<E extends string>(event: E, handler: EventHandler): EventUnsubscribe;
  off<E extends string>(event: E, handler: EventHandler): void;
  once<E extends string>(event: E, handler: EventHandler): EventUnsubscribe;
}
