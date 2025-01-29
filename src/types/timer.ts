// Common types
export interface Quote {
  text: string;
  author: string;
  timestamp?: string;
  task?: string;
}

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
  onComplete: () => void;
  onAddTime: () => void;
  onDurationChange?: (minutes: number) => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export interface TimerCircleProps {
  size: 'normal' | 'large';
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  circumference: number;
  a11yProps?: TimerA11yProps;
}

export interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onAddTime?: () => void;
  showAddTime?: boolean;
  size?: 'normal' | 'large';
  toggleButtonA11yProps?: ButtonA11yProps;
  completeButtonA11yProps?: ButtonA11yProps;
  addTimeButtonA11yProps?: ButtonA11yProps;
}

export interface MinutesInputProps {
  minutes: number;
  onMinutesChange: (minutes: number) => void;
  minMinutes: number;
  maxMinutes: number;
}

export interface ExpandedTimerProps {
  taskName: string;
  isRunning: boolean;
  onClose: () => void;
  timerCircleProps: Omit<TimerCircleProps, 'size'>;
  timerControlsProps: Omit<TimerControlsProps, 'size' | 'showAddTime'>;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  a11yProps?: TimerA11yProps;
}

export interface CompactTimerProps {
    taskName: string;
    isRunning: boolean;
    minutes: number;
    timerCircleProps: Omit<TimerCircleProps, "size">;
    timerControlsProps: TimerControlsProps;
    selectedSound: SoundOption;
    onSoundChange: (sound: SoundOption) => void;
    onTestSound: () => void;
    onMinutesChange: (minutes: number) => void;
    minMinutes: number;
    maxMinutes: number;
    a11yProps?: TimerA11yProps;
    isLoadingAudio?: boolean;
    onClick?: () => void;
  }  

// Sound types
export type SoundOption = 'bell' | 'chime' | 'ding' | 'none';

export interface SoundSelectorProps {
  selectedSound: SoundOption;
  onSoundChange: (sound: SoundOption) => void;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
}

// Constants
export const TIMER_CONSTANTS = {
  MIN_MINUTES: 1,
  MAX_MINUTES: 60,
  ADD_TIME_MINUTES: 5,
  TIMER_INTERVAL: 1000,
  CIRCLE_CIRCUMFERENCE: 2 * Math.PI * 45,
} as const;

export const SOUND_OPTIONS = {
  bell: "https://cdn.freesound.org/previews/80/80921_1022651-lq.mp3",
  chime: "https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3",
  ding: "https://cdn.freesound.org/previews/536/536108_11943129-lq.mp3",
  none: "",
} as const;