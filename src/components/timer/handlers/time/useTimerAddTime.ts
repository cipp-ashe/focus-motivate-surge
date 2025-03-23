
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { eventManager } from "@/lib/events/EventManager";
import { TIMER_CONSTANTS } from "@/types/timer/constants";
import { EventType } from "@/types/events";

interface UseTimerAddTimeProps {
  addTime: (minutes: number) => void;
  onAddTime?: (minutes: number) => void;
  taskName: string;
  metrics: TimerStateMetrics;
  timeLeft: number;
  isRunning: boolean;
}

export const useTimerAddTime = ({
  addTime,
  onAddTime,
  taskName,
  metrics,
  timeLeft,
  isRunning
}: UseTimerAddTimeProps) => {
  const handleAddTime = useCallback((minutes: number) => {
    console.log(`Adding ${minutes} minutes to timer`);
    
    // Add the time
    addTime(minutes);
    
    // Call external handler if provided
    if (onAddTime) {
      onAddTime(minutes);
    }
    
    // Calculate newly extended time
    const secondsToAdd = minutes * 60;
    const newTimeLeft = timeLeft + secondsToAdd;
    
    // Emit tick event with updated time left
    eventManager.emit('timer:tick', { 
      timeLeft: newTimeLeft, 
      taskName,
      remaining: newTimeLeft  // Add remaining property for compatibility
    });
    
    console.log(`Timer extended by ${minutes} minutes. New time left: ${newTimeLeft}s`);
  }, [addTime, onAddTime, taskName, timeLeft, isRunning]);

  return handleAddTime;
};
