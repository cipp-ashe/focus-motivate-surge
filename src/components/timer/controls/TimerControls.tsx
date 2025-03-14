
import React from "react";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon, CheckIcon, PlusIcon } from "lucide-react";
import type { TimerControlsProps, ButtonA11yProps } from "@/types/timer";
import { logger } from "@/utils/logManager";

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  onToggle,
  onComplete,
  onAddTime,
  showAddTime = true,
  size = "normal",
  toggleButtonA11yProps,
  completeButtonA11yProps,
  addTimeButtonA11yProps,
  metrics,
  pauseTimeLeft,
}) => {
  logger.debug("TimerControls", `TimerControls rendering:`, {
    isRunning,
    isPaused,
    showAddTime,
  });

  const buttonSize = size === "large" ? "h-12 w-12" : "h-10 w-10";
  const iconSize = size === "large" ? "h-6 w-6" : "h-5 w-5";
  const gapSize = size === "large" ? "gap-4" : "gap-2";

  // Handle complete click - ensuring we properly handle the Promise return type
  const handleCompleteClick = async () => {
    if (onComplete) {
      try {
        // Explicitly await the Promise returned by onComplete
        await onComplete();
      } catch (error) {
        console.error("Error completing timer:", error);
      }
    }
  };

  return (
    <div className={`flex ${gapSize} items-center justify-center`}>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonSize} rounded-full bg-card hover:bg-card/80 border-primary-foreground/20`}
        onClick={onToggle}
        data-testid="timer-toggle-button"
        {...toggleButtonA11yProps}
      >
        {isRunning ? (
          <PauseIcon className={iconSize} />
        ) : (
          <PlayIcon className={iconSize} />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`${buttonSize} rounded-full bg-green-500 hover:bg-green-600 border-none text-white`}
        onClick={handleCompleteClick}
        data-testid="timer-complete-button"
        {...completeButtonA11yProps}
      >
        <CheckIcon className={iconSize} />
      </Button>

      {showAddTime && onAddTime && (
        <Button
          variant="outline"
          size="icon"
          className={`${buttonSize} rounded-full bg-card hover:bg-card/80 border-primary-foreground/20`}
          onClick={() => onAddTime(5)}
          data-testid="timer-add-time-button"
          {...addTimeButtonA11yProps}
        >
          <PlusIcon className={iconSize} />
        </Button>
      )}
    </div>
  );
};
