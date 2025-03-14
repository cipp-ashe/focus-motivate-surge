
// Core timer hooks
export { useTimer } from './useTimer';
export { useTimerState } from './useTimerState';
export { useTimerMetrics } from './useTimerMetrics';
export { useTimerControls } from './useTimerControls';
export { useTimerActions } from './useTimerActions';

// Timer accessibility and UI hooks
export { useTimerA11y } from './useTimerA11y';
export { useTimerEffects } from './useTimerEffects';
export { useTimerShortcuts } from './useTimerShortcuts';

// Timer event hooks - reference from the correct paths
export { useTimerEvents } from '@/components/timer/hooks/events/useTimerEvents';
export { useTimerCountdown } from '@/components/timer/hooks/events/useTimerCountdown';
export { useTimerPauseResume } from '@/components/timer/hooks/events/useTimerPauseResume';
export { useTimerEventListeners } from '@/components/timer/hooks/useTimerEventListeners';

// Timer monitoring
export { useTimerMonitor } from '@/hooks/useTimerMonitor';

// Timer initialization
export { 
  useTimerCore,
  useTimerComplete,
  useTimerEvents as useTimerInitEvents,
  useTimerHandlers as useTimerInitHandlers,
  useTimerMonitoring,
  useTimerViews,
  useTimerAutoComplete
} from '@/components/timer/hooks/initialization';

// Types
export * from './types';
