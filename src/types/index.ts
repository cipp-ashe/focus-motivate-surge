
/**
 * Types Index
 * 
 * This file re-exports all types from the various type modules
 * to provide a single import point for consumers.
 */

// Core types
export * from './core';

// Domain-specific types
export * from './habit';
export * from './task';
export * from './note';
export * from './timer';
export * from './event';

// For backward compatibility
// These imports can be deprecated in the future
// as consumers migrate to the new import pattern
export { EventType, EventPayload, EventCallback } from './event';
export { HabitDetail, ActiveTemplate, DayOfWeek } from './habit';
export { TimerStateMetrics as TimerMetrics } from './timer';
