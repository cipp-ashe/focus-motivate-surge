
// Re-export all timer components
export { Timer } from './Timer';
export { TimerControls } from './controls/TimerControls';
export { TimerCircle } from './components/TimerCircle';
export { MinutesInput } from '../minutes/MinutesInput';
export { SoundSelector } from '../SoundSelector';

// Re-export timer views
export { TimerCompactView } from './views/TimerCompactView';
export { TimerExpandedView } from './views/TimerExpandedView';
export { TimerSection } from './TimerSection';

// Re-export hooks
export { useTimerInitialization } from './hooks/useTimerInitialization';
export { useTimerHandlers } from './hooks/initialization/useTimerHandlers';
export { useTimerCore } from './hooks/initialization/useTimerCore';
export { useTimerAudio } from './hooks/initialization/useTimerAudio';
export { useTimerActions } from './hooks/initialization/useTimerActions';
export { useTimerEvents } from './hooks/initialization/useTimerEvents';
export { useTimerComplete } from './hooks/initialization/useTimerComplete';
export { useTimerMonitoring } from './hooks/initialization/useTimerMonitoring';
export { useTimerViews } from './hooks/initialization/useTimerViews';
export { useAutoComplete } from './hooks/useAutoComplete';

// Re-export handler hooks
export { useTimerToggle } from './handlers/toggle/useTimerToggle';
export { useTimerAddTime } from './handlers/time/useTimerAddTime';
export { useTimerReset } from './handlers/reset/useTimerReset';
export { useTimerPauseResume } from './handlers/pause/useTimerPauseResume';
export { useTimerClose } from './handlers/close/useTimerClose';

// Type re-exports from timer types
export type {
  MinutesInputProps,
  TimerA11yProps,
  ButtonA11yProps,
  SoundSelectorProps,
  TimerControlsProps,
  TimerCircleProps,
  TimerProps
} from '@/types/timer/components';

export type { TimerExpandedViewRef } from '@/types/timer/views';
export type { SoundOption, Quote } from '@/types/timer/models';
