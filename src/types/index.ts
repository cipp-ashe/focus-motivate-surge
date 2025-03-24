/**
 * Types Index
 *
 * This file re-exports all types from the various type modules
 * to provide a single import point for consumers.
 */

// Core types
export * from './core';

// Event system types
export * from './events';

// Domain-specific types
export * from './habit';
export * from './task';

// Note: Explicitly re-export to avoid naming conflicts
import * as NoteTypes from './note';
export { NoteTypes };

// Timer: Explicitly re-export to avoid naming conflicts
import * as TimerTypes from './timer';
export { TimerTypes };

// Export metrics types
export * from './metrics';

// Export component-specific types
export * from './habitComponents';

// Export additional types with namespace to avoid conflicts
import * as TasksTypes from './tasks';
export { TasksTypes };

import * as NotesTypes from './notes';
export { NotesTypes };

export * from './voiceNotes';
