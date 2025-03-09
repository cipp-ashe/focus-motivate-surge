
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { eventBus } from "@/lib/eventBus";

export const useAutoComplete = ({
  isRunning,
  pause,
  playSound,
  metrics,
  completeTimer,
  onComplete,
  taskName,
  setCompletionMetrics,
  setShowCompletion,
}: {
  isRunning: boolean;
  pause: () => void;
  playSound: () => Promise<void>;
  metrics: TimerStateMetrics;
  completeTimer: () => Promise<void>;
  onComplete: ((metrics: TimerStateMetrics) => void) | undefined;
  taskName: string;
  setCompletionMetrics: (metrics: TimerStateMetrics | null) => void;
  setShowCompletion: (show: boolean) => void;
}) => {
  return useCallback(async () => {
    if (isRunning) {
      pause();
    }
    
    playSound();
    
    const completionMetrics: TimerStateMetrics = {
      ...metrics,
      completionStatus: "Completed On Time"
    };
    
    await completeTimer();
    
    setCompletionMetrics(completionMetrics);
    setShowCompletion(true);
    
    if (onComplete) {
      onComplete(completionMetrics);
    }
    
    const tasks = JSON.parse(localStorage.getItem('taskList') || '[]');
    const habitTask = tasks.find((t: any) => t.name === taskName && t.relationships?.habitId);
    
    if (habitTask) {
      console.log('Completing timer task for habit:', habitTask);
      eventBus.emit('task:complete', { 
        taskId: habitTask.id,
        metrics: completionMetrics
      });
    }
  }, [isRunning, pause, playSound, metrics, completeTimer, onComplete, taskName, setCompletionMetrics, setShowCompletion]);
};
