
/**
 * Timer constants used throughout the application
 */
export const TIMER_CONSTANTS = {
  // Default timer duration in minutes (25 minutes)
  DEFAULT_DURATION_MINUTES: 25,
  
  // Default timer duration in seconds (25 minutes)
  DEFAULT_DURATION: 25 * 60,
  
  // Minutes to add when using the "Add Time" button
  ADD_TIME_MINUTES: 5,
  
  // Maximum timer duration in minutes
  MAX_DURATION_MINUTES: 120,
  
  // Minimum timer duration in minutes
  MIN_DURATION_MINUTES: 1,
  
  // Default break duration in minutes (5 minutes)
  DEFAULT_BREAK_DURATION: 5 * 60,
  
  // Sound options
  DEFAULT_SOUND: 'bell'
};

/**
 * Sound options available for timer notifications
 */
export const SOUND_OPTIONS = [
  { value: 'bell', label: 'Bell' },
  { value: 'chime', label: 'Chime' },
  { value: 'gong', label: 'Gong' },
  { value: 'notification', label: 'Notification' },
  { value: 'success', label: 'Success' },
  { value: 'none', label: 'None' }
];
