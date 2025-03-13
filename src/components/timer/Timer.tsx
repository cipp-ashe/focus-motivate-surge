
import React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import type { TimerProps } from "@/types/timer";
import { TimerError } from "./TimerError";
import { TimerContent } from "./TimerContent";
import { useTimerInitialization } from "./hooks/useTimerInitialization";
import { TimerErrorBoundary } from "./TimerErrorBoundary";

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites = [],
  setFavorites
}: TimerProps) => {
  console.log('Timer component rendering with:', {
    duration,
    taskName,
    isValid: Boolean(duration && taskName)
  });

  // Validate required props
  if (!duration || !taskName) {
    console.error('Timer missing required props:', { duration, taskName });
    return (
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerError />
      </Card>
    );
  }

  // Wrap onComplete to ensure it receives valid metrics
  const handleComplete = React.useCallback((metrics: any) => {
    console.log("Timer: handleComplete with metrics:", metrics);
    
    try {
      // Ensure we have valid metrics with all required fields
      const validatedMetrics = {
        ...metrics,
        // Make sure we have these required fields with default values if needed
        startTime: metrics.startTime || new Date(),
        endTime: metrics.endTime || new Date(),
        // Ensure completionDate is a string, not a Date object
        completionDate: typeof metrics.completionDate === 'string' 
          ? metrics.completionDate 
          : new Date().toISOString()
      };
      
      console.log("Timer: Validated metrics:", validatedMetrics);
      
      if (onComplete) {
        onComplete(validatedMetrics);
      }
    } catch (error) {
      console.error("Error in timer completion callback:", error);
      toast.error("Error completing timer");
    }
  }, [onComplete]);

  // Initialize the timer
  const timerProps = useTimerInitialization({
    duration,
    taskName,
    onComplete: handleComplete,
    onAddTime,
    onDurationChange,
  });

  return (
    <TimerErrorBoundary>
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerContent
          {...timerProps}
          favorites={favorites}
          setFavorites={setFavorites}
          taskName={taskName} // Ensure taskName is explicitly passed
        />
      </Card>
    </TimerErrorBoundary>
  );
};

Timer.displayName = 'Timer';
