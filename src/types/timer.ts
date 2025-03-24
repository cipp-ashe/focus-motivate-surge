
/**
 * Timer Types
 */

// Timer state
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  timeRemaining: number;
  duration: number;
  startTime: number | null;
  pauseTime: number | null;
  endTime: number | null;
  totalPausedTime: number;
  additionalTime: number;
}

// Timer metrics
export interface TimerMetrics {
  startTime: string;
  endTime: string;
  completionDate: string;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  completionStatus: 'completed' | 'abandoned' | 'extended';
  taskId?: string;
}

// Timer settings
export interface TimerSettings {
  autoStartBreak: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  notificationsEnabled: boolean;
  theme: 'default' | 'minimal' | 'focused';
  soundType: 'bell' | 'chime' | 'ding';
}

// Timer UI Components
export interface TimerComponentProps {
  models?: any;
  components?: any;
  constants?: any;
  ui?: any;
  views?: any;
  state?: any;
}

// Timer props
export interface TimerProps {
  duration: number;
  taskName: string;
  taskId?: string;
  onComplete?: (metrics: TimerMetrics) => void;
  onAddTime?: (minutes: number) => void;
  onDurationChange?: (newDuration: number) => void;
  favorites?: Quote[];
  setFavorites?: (newFavorites: Quote[]) => void;
}

// Timer expanded view ref
export interface TimerExpandedViewRef {
  expand: () => void;
  collapse: () => void;
  toggleExpand: () => void;
}

// Timer circle props
export interface TimerCircleProps {
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  timeLeft: number;
  duration: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

// Sound option
export type SoundOption = 'bell' | 'chime' | 'beep' | 'notification' | 'subtle' | 'none';

// Quote
export interface Quote {
  id: string;
  text: string;
  author: string;
  isFavorite: boolean;
  category: string | string[];
  task?: string;
  timestamp?: string;
}
