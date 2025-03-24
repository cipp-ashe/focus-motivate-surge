
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
