
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { eventBus } from "@/lib/eventBus";
import { toast } from "sonner";

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
  playSound: () => void;
  metrics: TimerStateMetrics;
  completeTimer: () => Promise<void>;
  onComplete?: (metrics: TimerStateMetrics) => void;
  taskName: string;
  setCompletionMetrics: (metrics: TimerStateMetrics | null) => void;
  setShowCompletion: (show: boolean) => void;
}): (() => Promise<void>) => {
  // Return a callback that explicitly returns a Promise<void>
  const handleComplete = useCallback(async (): Promise<void> => {
    if (isRunning) {
      pause();
    }
    
    playSound();
    
    const completionMetrics: TimerStateMetrics = {
      ...metrics,
      completionStatus: "Completed On Time"
    };
    
    try {
      // Await the Promise from completeTimer
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
        toast.success(`Completed timer for habit: ${taskName}`, { duration: 2000 });
      } else {
        toast.success(`Timer completed: ${taskName}`, { duration: 2000 });
      }
      
      // Explicitly return a resolved promise
      return Promise.resolve();
    } catch (error) {
      console.error("Error completing timer:", error);
      // Return a rejected promise for the error case
      return Promise.reject(error);
    }
  }, [isRunning, pause, playSound, metrics, completeTimer, onComplete, taskName, setCompletionMetrics, setShowCompletion]);
  
  return handleComplete;
};
