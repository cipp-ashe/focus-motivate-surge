
import React from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import type { TimerProps } from '@/types/timer/components';
import { TimerError } from './TimerError';
import { TimerContent } from './TimerContent';
import { useTimerInitialization } from './hooks/useTimerInitialization';
import { TimerErrorBoundary } from './TimerErrorBoundary';
import { toISOString } from '@/lib/utils/dateUtils';
import { logger } from '@/utils/logManager';
import { Quote } from '@/types/timer/models';

export const Timer = ({
  duration,
  taskName,
  taskId,
  onComplete,
  onAddTime,
  onDurationChange,
  favorites = [],
  setFavorites = () => {},
}: TimerProps) => {
  logger.debug('Timer', 'Timer component rendering with:', {
    duration,
    taskName,
    taskId,
    isValid: Boolean(duration && taskName),
  });

  // Validate required props
  if (!duration || !taskName) {
    logger.error('Timer', 'Timer missing required props:', { duration, taskName });
    return (
      <Card className="shadow-md border-border/20 overflow-hidden dark:border-border/10 dark:bg-card/40">
        <TimerError message="Missing required timer properties (duration or task name)" />
      </Card>
    );
  }

  // Wrap onComplete to ensure it receives valid metrics and handle errors gracefully
  const handleComplete = React.useCallback(
    (metrics: any) => {
      try {
        logger.debug('Timer', 'Timer: handleComplete with metrics:', metrics);

        // Ensure we have valid metrics with all required fields
        const validatedMetrics = {
          ...metrics,
          // Make sure we have these required fields with default values if needed
          startTime: metrics.startTime || toISOString(new Date()),
          endTime: metrics.endTime || toISOString(new Date()),
          // Ensure completionDate is a properly formatted ISO string
          completionDate: metrics.completionDate || toISOString(new Date()),
          // Ensure numeric values are actually numbers
          actualDuration: typeof metrics.actualDuration === 'number' ? metrics.actualDuration : 0,
          pausedTime: typeof metrics.pausedTime === 'number' ? metrics.pausedTime : 0,
          extensionTime: typeof metrics.extensionTime === 'number' ? metrics.extensionTime : 0,
          netEffectiveTime:
            typeof metrics.netEffectiveTime === 'number' ? metrics.netEffectiveTime : 0,
          // Add taskId to metrics if available
          taskId: taskId || metrics.taskId,
        };

        logger.debug('Timer', 'Timer: Validated metrics:', validatedMetrics);

        if (onComplete) {
          onComplete(validatedMetrics);
        }
      } catch (error) {
        logger.error('Timer', 'Error in timer completion callback:', error);
        toast.error('Error completing timer');
      }
    },
    [onComplete, taskId]
  );

  // Error handling for initialization
  const handleInitializationError = React.useCallback((error: any) => {
    logger.error('Timer', 'Error initializing timer:', error);
    toast.error('Could not initialize timer. Please try again.');
  }, []);

  // Initialize the timer with error handling
  let timerProps;
  try {
    timerProps = useTimerInitialization({
      duration,
      taskName,
      taskId,
      onComplete: handleComplete,
      onAddTime,
      onDurationChange,
    });
  } catch (error) {
    logger.error('Timer', 'Fatal error in timer initialization:', error);
    return (
      <Card className="shadow-md border-border/20 overflow-hidden dark:border-border/10 dark:bg-card/40">
        <TimerError
          message={`Could not initialize timer: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`}
        />
      </Card>
    );
  }

  // Transform favorites to match expected format if needed
  const adaptedFavorites = favorites.map((quote) => ({
    ...quote,
    isFavorite: quote.isFavorite ?? false,
  }));

  return (
    <TimerErrorBoundary>
      <TimerContent
        {...timerProps}
        favorites={adaptedFavorites}
        setFavorites={setFavorites}
        taskName={taskName}
      />
    </TimerErrorBoundary>
  );
};

Timer.displayName = 'Timer';
