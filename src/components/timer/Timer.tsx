
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

  return (
    <TimerErrorBoundary>
      <Card className="shadow-md border-border/20 overflow-hidden">
        <TimerContent
          {...useTimerInitialization({
            duration,
            taskName,
            onComplete,
            onAddTime,
            onDurationChange,
          })}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </Card>
    </TimerErrorBoundary>
  );
};

Timer.displayName = 'Timer';
