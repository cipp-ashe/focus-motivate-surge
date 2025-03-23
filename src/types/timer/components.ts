
import { SoundOption, Quote } from './models';

export interface MinutesInputProps {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
  onBlur?: () => void;
}

export interface TimerA11yProps {
  ariaLabel?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  ariaAtomic?: boolean;
}

export interface ButtonA11yProps {
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
}

export interface SoundSelectorProps {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
}

export interface TimerCircleProps {
  percentage: number;
  timeLeft: number;
  duration: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  taskName: string;
}

export interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onAddTime: (minutes: number) => void;
  disabled?: boolean;
  onToggle?: () => void;
  onComplete?: () => Promise<void>;
  showAddTime?: boolean;
  size?: 'sm' | 'md' | 'lg';
  toggleButtonA11yProps?: ButtonA11yProps;
  completeButtonA11yProps?: ButtonA11yProps;
  addTimeButtonA11yProps?: ButtonA11yProps;
  metrics?: any;
  pauseTimeLeft?: number | null;
}
