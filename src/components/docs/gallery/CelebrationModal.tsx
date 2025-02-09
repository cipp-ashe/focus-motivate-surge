
import React from 'react';
import { CompletionCelebration } from "@/components/timer/CompletionCelebration";
import { type TimerStateMetrics } from "@/types/metrics";

interface CelebrationModalProps {
  isActive: boolean;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ isActive, onClose }) => {
  const demoMetrics: TimerStateMetrics = {
    expectedTime: 1500,
    actualDuration: 1450,
    pauseCount: 2,
    favoriteQuotes: 1,
    pausedTime: 300,
    extensionTime: 0,
    netEffectiveTime: 1150,
    efficiencyRatio: 95,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null,
    startTime: new Date(),
    endTime: new Date(),
    lastPauseTimestamp: null
  };

  return isActive ? (
    <CompletionCelebration
      metrics={demoMetrics}
      onComplete={onClose}
    />
  ) : null;
};
