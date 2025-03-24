
/**
 * Journal Utility Functions
 * 
 * Common utilities for working with journal entries
 */

import { eventManager } from '@/lib/events/EventManager';

/**
 * Save a journal entry
 */
export function saveJournalEntry(taskId: string, entry: string): void {
  eventManager.emit('journal:save', { taskId, entry });
}

/**
 * Load a journal entry
 */
export function loadJournalEntry(taskId: string): string | null {
  try {
    const entries = JSON.parse(localStorage.getItem('journal-entries') || '{}');
    return entries[taskId] || null;
  } catch (error) {
    console.error('Error loading journal entry:', error);
    return null;
  }
}

/**
 * Delete a journal entry
 */
export function deleteJournalEntry(taskId: string): void {
  eventManager.emit('journal:delete', { taskId });
}

/**
 * Format a journal entry for display
 */
export function formatJournalEntry(entry: string): string {
  if (!entry) return '';
  
  // Simple formatting - could be expanded later
  return entry
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
