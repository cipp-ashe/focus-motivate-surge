
import { TimerMetrics } from '../metrics';
import type { Quote } from './models';

// A11y props types
export interface TimerA11yProps {
  "aria-label"?: string;
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-expanded"?: boolean;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
  "aria-valuetext"?: string;
  role?: string;
  tabIndex?: number;
  ref?: React.RefObject<HTMLDivElement>;
}

export interface ButtonA11yProps {
  "aria-label"?: string;
  "aria-pressed"?: boolean;
}

// Component Props
export interface TimerProps {
  duration: number;
  taskName: string;
  taskId?: string;
  onComplete: (metrics: TimerMetrics) => void;
  onAddTime: (minutes: number) => void;
  onDurationChange?: (minutes: number) => void;
  favorites?: Quote[];
  setFavorites?: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export interface TimerHeaderProps {
  taskName: string;
  onCloseTimer: () => void;
}

export interface TimerBodyProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  showCompletion: boolean;
  taskName: string;
  timerCircleProps: TimerCircleProps;
  timerControlsProps: TimerControlsProps;
  metrics: TimerMetrics;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
  testSound: () => void;
  isLoadingAudio: boolean;
  updateMetrics: (updates: Partial<TimerMetrics>) => void;
  expandedViewRef: React.RefObject<any>;
  handleCloseTimer: () => void;
  favorites?: Quote[];
  setFavorites?: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export interface TimerCircleProps {
  size?: 'normal' | 'large';
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  circumference?: number;
  a11yProps?: TimerA11yProps;
  onClick?: () => void;
}

export interface TimerControlsProps {
  isRunning: boolean;
  isPaused?: boolean;
  onToggle: () => void;
  onComplete: () => Promise<void>;
  onAddTime?: (minutes: number) => void;
  showAddTime?: boolean;
  size?: 'normal' | 'large';
  toggleButtonA11yProps?: ButtonA11yProps;
  completeButtonA11yProps?: ButtonA11yProps;
  addTimeButtonA11yProps?: ButtonA11yProps;
  metrics?: TimerMetrics;
  pauseTimeLeft?: number | null;
}

export interface MinutesInputProps {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
  onBlur?: () => void;
}

// Sound types
export type SoundOption = 'bell' | 'chime' | 'ding' | 'none';

export interface SoundSelectorProps {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
}

// Adding the missing TimerExpandedViewRef type
export interface TimerExpandedViewRef {
  expand: () => void;
  collapse: () => void;
  toggleExpansion: () => void;
  isExpanded: boolean;
}
