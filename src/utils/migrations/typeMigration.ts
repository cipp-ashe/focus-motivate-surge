
import { migrateTaskTypes } from '@/lib/storage/task/taskMigration';

// A map of migration functions and their descriptions
const migrations = [
  {
    name: 'migrateTaskTypes',
    description: 'Migrate legacy task types to the new unified type system',
    fn: migrateTaskTypes
  },
  {
    name: 'migrateVoiceNotes',
    description: 'Migrate voice notes to the new notes system',
    fn: migrateVoiceNotesToNotes
  },
  {
    name: 'migrateMetricTypes',
    description: 'Update habit metric types to align with task types',
    fn: migrateMetricTypes
  }
];

/**
 * Run all data migrations for the type system
 */
export function runDataMigration() {
  console.log('Starting data migration...');
  try {
    // Run each migration in sequence
    let results = [];
    
    for (const migration of migrations) {
      console.log(`Running migration: ${migration.name} - ${migration.description}`);
      try {
        const result = migration.fn();
        results.push({ name: migration.name, success: true, result });
        console.log(`Migration ${migration.name} completed successfully`);
      } catch (error) {
        console.error(`Migration ${migration.name} failed:`, error);
        results.push({ name: migration.name, success: false, error });
      }
    }
    
    // Check if all migrations were successful
    const allSuccessful = results.every(r => r.success);
    console.log(`Data migration ${allSuccessful ? 'completed successfully' : 'completed with errors'}`);
    
    return allSuccessful;
  } catch (error) {
    console.error('Error during data migration:', error);
    return false;
  }
}

/**
 * Migrate voice notes to the new notes system
 */
function migrateVoiceNotesToNotes() {
  console.log('Starting voice notes migration');
  
  try {
    // Load existing voice notes
    const voiceNotesStr = localStorage.getItem('voiceNotes');
    if (!voiceNotesStr) {
      console.log('No voice notes to migrate');
      return 0;
    }
    
    const voiceNotes = JSON.parse(voiceNotesStr);
    if (!Array.isArray(voiceNotes) || voiceNotes.length === 0) {
      console.log('No voice notes to migrate');
      return 0;
    }
    
    // Load existing notes
    const notesStr = localStorage.getItem('notes');
    const notes = notesStr ? JSON.parse(notesStr) : [];
    
    // Track how many notes were migrated
    let migratedCount = 0;
    
    // Convert each voice note to the new note format
    for (const voiceNote of voiceNotes) {
      // Skip if this voice note has already been migrated (check by audioUrl)
      const alreadyMigrated = notes.some(note => 
        note.audio && note.audio.url === voiceNote.audioUrl
      );
      
      if (alreadyMigrated) {
        console.log(`Voice note with URL ${voiceNote.audioUrl} already migrated, skipping`);
        continue;
      }
      
      // Create a new note from the voice note
      const newNote = {
        id: voiceNote.id || `voice-note-${Date.now()}-${migratedCount}`,
        title: voiceNote.title || 'Voice Note',
        content: voiceNote.text || '',
        contentType: 'audio',
        createdAt: voiceNote.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [{ name: 'voice-note', color: 'red' }],
        audio: {
          url: voiceNote.audioUrl,
          duration: voiceNote.duration || 0,
          transcript: voiceNote.text || '',
          recordedAt: voiceNote.createdAt || new Date().toISOString()
        }
      };
      
      // Add the new note to the notes array
      notes.push(newNote);
      migratedCount++;
      
      console.log(`Migrated voice note: ${newNote.title}`);
    }
    
    // Save the updated notes
    if (migratedCount > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
      console.log(`Migrated ${migratedCount} voice notes to the notes system`);
    }
    
    return migratedCount;
  } catch (error) {
    console.error('Error migrating voice notes:', error);
    return 0;
  }
}

/**
 * Migrate habit metric types to align with the new task type system
 */
function migrateMetricTypes() {
  console.log('Starting habit metric types migration');
  
  try {
    // Load active templates
    const templatesStr = localStorage.getItem('habit-templates');
    if (!templatesStr) {
      console.log('No habit templates to migrate');
      return 0;
    }
    
    const templates = JSON.parse(templatesStr);
    if (!Array.isArray(templates) || templates.length === 0) {
      console.log('No habit templates to migrate');
      return 0;
    }
    
    let migratedCount = 0;
    
    // Update each template's habits
    for (const template of templates) {
      if (!template.habits || !Array.isArray(template.habits)) {
        continue;
      }
      
      // Update each habit's metrics
      for (const habit of template.habits) {
        if (!habit.metrics) {
          habit.metrics = { type: 'boolean' };
          migratedCount++;
          continue;
        }
        
        // Ensure the habit has a metric type
        if (!habit.metrics.type) {
          habit.metrics.type = 'boolean';
          migratedCount++;
        }
        
        // Add trackingType based on the type
        if (!habit.metrics.trackingType) {
          switch (habit.metrics.type) {
            case 'timer':
              habit.metrics.trackingType = 'timer';
              break;
            case 'journal':
              habit.metrics.trackingType = 'journal';
              break;
            case 'counter':
              habit.metrics.trackingType = 'counter';
              break;
            case 'rating':
              habit.metrics.trackingType = 'rating';
              break;
            default:
              habit.metrics.trackingType = 'regular';
          }
          migratedCount++;
        }
      }
    }
    
    // Save the updated templates
    if (migratedCount > 0) {
      localStorage.setItem('habit-templates', JSON.stringify(templates));
      console.log(`Updated ${migratedCount} habit metrics`);
    }
    
    return migratedCount;
  } catch (error) {
    console.error('Error migrating habit metric types:', error);
    return 0;
  }
}
