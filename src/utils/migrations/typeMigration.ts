
/**
 * Type Migration Utilities
 * 
 * This module provides functions to migrate old data formats to the new
 * unified type system.
 */

import { Task, TaskType } from '@/types/tasks';
import { HabitDetail, HabitMetrics } from '@/types/habits/unified';
import { Note } from '@/types/notes';

/**
 * Migrate legacy MetricType to new TaskType
 */
export function migrateMetricTypeToTaskType(metricType: string): TaskType {
  switch (metricType) {
    case 'boolean':
      return 'regular';
    case 'timer':
      return 'timer';
    case 'journal':
      return 'journal';
    case 'counter':
      return 'counter';
    case 'rating':
      return 'rating';
    default:
      return 'regular';
  }
}

/**
 * Migrate legacy habit metrics to new format
 */
export function migrateHabitMetrics(habit: any): HabitMetrics {
  // Extract old metrics format
  const oldMetrics = habit.metrics || {};
  const oldType = oldMetrics.type || 'boolean';
  
  // Create new metrics format
  return {
    trackingType: migrateMetricTypeToTaskType(oldType),
    target: oldMetrics.target,
    unit: oldMetrics.unit,
    scale: oldType === 'rating' ? 5 : undefined
  };
}

/**
 * Migrate existing habits to new format
 */
export function migrateHabit(habit: any): HabitDetail {
  return {
    ...habit,
    metrics: migrateHabitMetrics(habit)
  };
}

/**
 * Migrate existing tasks to new format
 */
export function migrateTask(task: any): Task {
  // Ensure taskType is set
  let taskType: TaskType = task.taskType || 'regular';
  
  // If no taskType but has relationships with metricType, use that
  if (!task.taskType && task.relationships?.metricType) {
    taskType = migrateMetricTypeToTaskType(task.relationships.metricType);
  }
  
  // Return migrated task
  return {
    ...task,
    taskType
  };
}

/**
 * Migrate voice notes to the notes system
 */
export function migrateVoiceNoteToNote(voiceNote: any): Note {
  const now = new Date().toISOString();
  
  return {
    id: `voice-${voiceNote.id}`,
    title: `Voice Note (${new Date(voiceNote.createdAt || now).toLocaleString()})`,
    content: voiceNote.text || '',
    contentType: 'audio',
    createdAt: voiceNote.createdAt || now,
    updatedAt: voiceNote.createdAt || now,
    tags: [{ name: 'voice-note', color: 'red' }],
    audio: {
      url: voiceNote.audioUrl || '',
      duration: voiceNote.duration || 0,
      transcript: voiceNote.text || '',
      recordedAt: voiceNote.createdAt || now
    }
  };
}

/**
 * Migrate journal entry to a note
 */
export function migrateJournalEntryToNote(journalEntry: any): Note {
  const now = new Date().toISOString();
  
  return {
    id: `journal-${journalEntry.id || new Date().getTime()}`,
    title: journalEntry.title || `Journal Entry (${new Date(journalEntry.date || now).toLocaleString()})`,
    content: journalEntry.content || '',
    contentType: 'text',
    createdAt: journalEntry.date || now,
    updatedAt: journalEntry.date || now,
    tags: [
      { name: 'journal', color: 'green' },
      { name: journalEntry.type || 'reflection', color: 'blue' }
    ],
    relationships: journalEntry.habitId ? [
      {
        entityId: journalEntry.habitId,
        entityType: 'habit',
        metadata: {
          templateId: journalEntry.templateId,
          date: journalEntry.date
        }
      }
    ] : undefined
  };
}

/**
 * Check storage for legacy data formats and migrate them
 */
export function migrateStorageData() {
  try {
    // Migrate tasks
    const tasksStr = localStorage.getItem('tasks');
    if (tasksStr) {
      const tasks = JSON.parse(tasksStr);
      if (Array.isArray(tasks)) {
        const migratedTasks = tasks.map(migrateTask);
        localStorage.setItem('tasks', JSON.stringify(migratedTasks));
        console.log(`Migrated ${migratedTasks.length} tasks`);
      }
    }
    
    // Migrate habit templates
    const templatesStr = localStorage.getItem('habit-templates');
    if (templatesStr) {
      const templates = JSON.parse(templatesStr);
      if (Array.isArray(templates)) {
        const migratedTemplates = templates.map(template => ({
          ...template,
          habits: template.habits.map(migrateHabit)
        }));
        localStorage.setItem('habit-templates', JSON.stringify(migratedTemplates));
        console.log(`Migrated ${migratedTemplates.length} templates`);
      }
    }
    
    // Migrate voice notes to notes
    const voiceNotesStr = localStorage.getItem('voiceNotes');
    if (voiceNotesStr) {
      const voiceNotes = JSON.parse(voiceNotesStr);
      if (Array.isArray(voiceNotes)) {
        // Load existing notes
        const notesStr = localStorage.getItem('notes');
        const existingNotes = notesStr ? JSON.parse(notesStr) : [];
        
        // Create voice note entries in notes
        const voiceNotesAsNotes = voiceNotes.map(migrateVoiceNoteToNote);
        
        // Combine with existing notes
        const combinedNotes = [...existingNotes, ...voiceNotesAsNotes];
        localStorage.setItem('notes', JSON.stringify(combinedNotes));
        console.log(`Migrated ${voiceNotesAsNotes.length} voice notes to notes`);
        
        // Clear old voice notes
        localStorage.removeItem('voiceNotes');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error during data migration:', error);
    return false;
  }
}

// Export a function to run the migration
export function runDataMigration() {
  console.log('Starting data migration to new unified type system...');
  const result = migrateStorageData();
  console.log('Data migration complete:', result ? 'Success' : 'Failed');
  return result;
}
