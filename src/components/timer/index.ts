
// Re-export timer components
export { Timer } from './Timer';
export { TimerCircle } from './TimerCircle';
export { TimerDisplay } from './TimerDisplay';
export { TimerControls } from './controls/TimerControls';
export { TimerSection } from './TimerSection';
export { TimerErrorBoundary } from './TimerErrorBoundary';
export { TimerCompletionDialog } from './TimerCompletionDialog';
export { CompletionCelebration } from './CompletionCelebration';
export { TimerCompactView } from './views/TimerCompactView';
export { TimerExpandedView } from './views/TimerExpandedView';
export { TimerHeader } from './TimerHeader';
export { TimerBody } from './components/TimerBody';
export { TimerCompletion } from './components/TimerCompletion';

// Re-export types
export type {
  TimerProps,
  TimerCircleProps,
  TimerControlsProps,
  MinutesInputProps,
  TimerA11yProps,
  ButtonA11yProps,
  SoundOption,
  SoundSelectorProps,
} from '@/types/timer';

