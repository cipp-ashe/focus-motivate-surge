
import React from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import type { TimerProps } from "@/types/timer";
import { TimerError } from "./TimerError";
import { TimerContent } from "./TimerContent";
import { useTimerInitialization } from "./hooks/useTimerInitialization";
import { TimerErrorBoundary } from "./TimerErrorBoundary";
import { toISOString } from "@/lib/utils/dateUtils";
import { logger } from "@/utils/logManager";

export const Timer = ({
  duration,
  taskName,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites = [],
  setFavorites = () => {}
}: TimerProps) => {
  logger.debug('Timer', 'Timer component rendering with:', {
    duration,
    taskName,
    isValid: Boolean(duration && taskName)
  });

  // Validate required props
  if (!duration || !taskName) {
    logger.error('Timer', 'Timer missing required props:', { duration, taskName });
    return (
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerError />
      </Card>
    );
  }

  // Wrap onComplete to ensure it receives valid metrics and handle errors gracefully
  const handleComplete = React.useCallback((metrics: any) => {
    try {
      logger.debug('Timer', "Timer: handleComplete with metrics:", metrics);
      
      // Ensure we have valid metrics with all required fields
      const validatedMetrics = {
        ...metrics,
        // Make sure we have these required fields with default values if needed
        startTime: metrics.startTime || new Date(),
        endTime: metrics.endTime || new Date(),
        // Ensure completionDate is a properly formatted ISO string
        completionDate: toISOString(metrics.completionDate || new Date())
      };
      
      logger.debug('Timer', "Timer: Validated metrics:", validatedMetrics);
      
      if (onComplete) {
        onComplete(validatedMetrics);
      }
    } catch (error) {
      logger.error('Timer', "Error in timer completion callback:", error);
      toast.error("Error completing timer");
    }
  }, [onComplete]);

  // Error handling for initialization
  const handleInitializationError = React.useCallback((error: any) => {
    logger.error('Timer', "Error initializing timer:", error);
    toast.error("Could not initialize timer. Please try again.");
  }, []);

  // Initialize the timer with error handling
  let timerProps; 
  try {
    timerProps = useTimerInitialization({
      duration,
      taskName,
      onComplete: handleComplete,
      onAddTime,
      onDurationChange,
    });
  } catch (error) {
    logger.error('Timer', "Fatal error in timer initialization:", error);
    return (
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerError message="Could not initialize timer" />
      </Card>
    );
  }

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
