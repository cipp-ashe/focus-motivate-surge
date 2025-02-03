export const TIMER_CONSTANTS = {
  MIN_MINUTES: 1,
  MAX_MINUTES: 60,
  ADD_TIME_MINUTES: 5,
  TIMER_INTERVAL: 1000,
  CIRCLE_CIRCUMFERENCE: 2 * Math.PI * 45,
} as const;

// Use absolute paths for local audio files
const BASE_URL = window.location.origin;

export const SOUND_OPTIONS = {
  bell: `${BASE_URL}/sounds/bell.mp3`,
  chime: `${BASE_URL}/sounds/chime.mp3`,
  ding: `${BASE_URL}/sounds/ding.mp3`,
  none: "",
} as const;
