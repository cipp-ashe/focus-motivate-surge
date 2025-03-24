
/**
 * Timer UI component types
 */

export interface TimerDisplayProps {
  timeLeft: number;
  duration: number;
  isActive: boolean;
  isPaused: boolean;
  taskName: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onComplete: () => void;
}

export interface TimerControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onComplete: () => void;
  onExtend: (minutes: number) => void;
}

export interface TimerProgressProps {
  timeLeft: number;
  duration: number;
  isActive: boolean;
  isPaused: boolean;
}

export interface TimerSessionProps {
  taskId?: string;
  taskName: string;
  duration: number;
  onSessionComplete: (metrics: any) => void;
  onSessionCancel: () => void;
}

export interface TimerMetricsDisplayProps {
  metrics: {
    startTime?: string;
    endTime?: string;
    expectedTime?: number;
    actualDuration?: number;
    pauseCount?: number;
    pausedTime?: number;
    extensionTime?: number;
    netEffectiveTime?: number;
    efficiencyRatio?: number;
  };
}

export type TimerPresetDuration = 5 | 15 | 25 | 30 | 45 | 60 | 90 | 120;

export interface TimerPresetsProps {
  onSelectPreset: (duration: number) => void;
  currentDuration: number;
}

