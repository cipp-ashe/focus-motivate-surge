
export const TIMER_CONSTANTS = {
  DEFAULT_DURATION: 25 * 60, // 25 minutes in seconds
  MIN_DURATION: 1 * 60, // 1 minute in seconds
  MAX_DURATION: 120 * 60, // 2 hours in seconds
  ADD_TIME_MINUTES: 5,
  MAX_ADD_TIME_MINUTES: 30,
  TICK_INTERVAL: 1000, // 1 second in milliseconds
};

export const SOUND_OPTIONS = [
  { value: 'bell', label: 'Bell' },
  { value: 'chime', label: 'Chime' },
  { value: 'gong', label: 'Gong' },
  { value: 'notification', label: 'Notification' },
  { value: 'success', label: 'Success' },
  { value: 'none', label: 'None' }
];
