export const TIMER_CONSTANTS = {
  MIN_MINUTES: 1,
  MAX_MINUTES: 60,
  ADD_TIME_MINUTES: 5,
  TIMER_INTERVAL: 1000,
  CIRCLE_CIRCUMFERENCE: 2 * Math.PI * 45,
} as const;

// Use absolute paths for local audio files
const BASE_URL = window.location.origin;
export type SoundOption = 'bell' | 'chime' | 'ding' | 'none';

export interface SoundSelectorProps {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
}

export const SOUND_OPTIONS = {
  bell: "https://cdn.freesound.org/previews/80/80921_1022651-lq.mp3",
  chime: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
  ding: "https://cdn.freesound.org/previews/536/536108_11943129-lq.mp3",
  none: "",
} as const;
