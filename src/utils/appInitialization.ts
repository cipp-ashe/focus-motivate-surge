
import { migrateTaskTypes } from '@/lib/storage/task/taskMigration';

/**
 * Initialize the application
 * - Run data migrations
 * - Set up event listeners
 * - Initialize services
 */
export const initializeApplication = () => {
  console.log('Initializing application...');
  
  // Run migrations
  const { migratedActive, migratedCompleted } = migrateTaskTypes();
  if (migratedActive > 0 || migratedCompleted > 0) {
    console.log(`Migration complete: ${migratedActive} active and ${migratedCompleted} completed tasks migrated`);
  } else {
    console.log('No task migration needed');
  }

  // Add more initialization steps here as needed
  
  console.log('Application initialization complete');
};
