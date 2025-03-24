
/**
 * Timer state definitions
 */

export interface TimerState {
  active: boolean;
  timeLeft: number;
  duration: number;
  taskId?: string;
  taskName: string;
  startTime?: string;
  pauseTime?: string;
  endTime?: string;
  pauseCount: number;
  totalPausedTime: number;
  completedSessions: number;
  taskCompleted: boolean;
  notes: string;
  quoteDisplayed?: string;
}

export interface TimerMetrics {
  startTime?: string;
  endTime?: string;
  pauseCount: number;
  totalPausedTime: number;
  completedSessions: number;
  expectedTime: number;
  actualDuration: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
}

export type TimerAction = 
  | { type: 'START'; payload: { duration: number; taskId?: string; taskName: string } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_TASK'; payload: { id: string; name: string; duration: number } }
  | { type: 'UPDATE_NOTES'; payload: string }
  | { type: 'SHOW_QUOTE'; payload: string }
  | { type: 'EXTEND_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number };

