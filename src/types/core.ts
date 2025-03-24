
// Define entity types used across the application
export const EntityType = {
  Task: 'task' as const,
  Note: 'note' as const,
  Habit: 'habit' as const,
  Timer: 'timer' as const,
  Tag: 'tag' as const,
  Profile: 'profile' as const,
  VoiceNote: 'voice-note' as const,
  Screenshot: 'screenshot' as const
} as const;

// Type for EntityType values
export type EntityType = typeof EntityType[keyof typeof EntityType];

// Common date format type
export type DateFormat = 'yyyy-MM-dd' | 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'MMM dd, yyyy';

// Common status types
export type Status = 'active' | 'completed' | 'archived' | 'pending' | 'deleted';

// Common day of week type
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Common time of day type
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Common difficulty level type
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

// Define tag colors
export type TagColor =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'indigo'
  | 'gray';

// Add isValidTagColor utility function
export const isValidTagColor = (color: string): color is TagColor => {
  const validColors: TagColor[] = [
    'red', 'green', 'blue', 'yellow', 'purple',
    'pink', 'orange', 'teal', 'cyan', 'indigo', 'gray'
  ];
  return validColors.includes(color as TagColor);
};

/**
 * Initialize the data store with required schema and default values
 * This function is called when the application is first loaded
 * or when the data store needs to be reset
 */
export const initializeDataStore = (): boolean => {
  try {
    // Initialize schema version
    localStorage.setItem('schema-version', '1.0');
    
    // Initialize entity relationships (empty object)
    localStorage.setItem('entity-relations', JSON.stringify({}));
    
    // Initialize tag relationships (empty object)
    localStorage.setItem('tag-relations', JSON.stringify({}));
    
    // Return success
    return true;
  } catch (error) {
    console.error('Failed to initialize data store:', error);
    return false;
  }
};
