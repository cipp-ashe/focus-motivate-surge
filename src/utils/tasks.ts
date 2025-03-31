
/**
 * Task Utility Functions
 * 
 * Common utilities for working with tasks
 */

import { Task, TaskStatus } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';

/**
 * Helper function to emit task events with error handling
 */
export function emitTaskEvent<T>(eventType: string, payload: T): boolean {
  try {
    eventManager.emit(eventType as any, payload);
    return true;
  } catch (error) {
    console.error(`Error emitting task event ${eventType}:`, error);
    return false;
  }
}

/**
 * Handle task status changes
 */
export function updateTaskStatus(taskId: string, status: TaskStatus): void {
  emitTaskEvent('task:update', { taskId, updates: { status } });
}

/**
 * Complete a task
 */
export function completeTask(taskId: string, metrics?: any): void {
  emitTaskEvent('task:complete', { taskId, metrics });
}

/**
 * Delete a task
 */
export function deleteTask(taskId: string, reason?: string): void {
  emitTaskEvent('task:delete', { taskId, reason });
}

/**
 * Format task metrics for display
 */
export function formatTaskMetrics(task: Task) {
  if (!task.metrics) return null;
  
  return {
    completionStatus: task.metrics.completionStatus || 'Completed',
    formattedDuration: task.metrics.actualDuration ? 
      `${Math.floor(task.metrics.actualDuration / 60)}m ${task.metrics.actualDuration % 60}s` : 
      'N/A',
    completedAt: task.completedAt ? new Date(task.completedAt).toLocaleString() : 'Unknown'
  };
}

/**
 * Check if a task is habit-related
 */
export function isHabitTask(task: Task): boolean {
  return !!(task.relationships && task.relationships.habitId);
}
