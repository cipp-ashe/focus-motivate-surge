
// Define entity types used across the application
export type EntityType = 
  | 'task' 
  | 'note' 
  | 'habit' 
  | 'timer' 
  | 'tag' 
  | 'profile' 
  | 'voice-note' 
  | 'screenshot';

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
