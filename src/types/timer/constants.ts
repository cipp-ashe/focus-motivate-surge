
import { SoundOption } from './components';

export const TIMER_CONSTANTS = {
  MIN_MINUTES: 1,
  MAX_MINUTES: 120,
  DEFAULT_MINUTES: 25,
  ADD_TIME_MINUTES: 5,
  CIRCLE_SIZE: 240,
  STROKE_WIDTH: 8,
};

export const SOUND_OPTIONS: { value: SoundOption; label: string }[] = [
  { value: 'bell', label: 'Bell' },
  { value: 'chime', label: 'Chime' },
  { value: 'ding', label: 'Ding' },
  { value: 'none', label: 'None' },
];
