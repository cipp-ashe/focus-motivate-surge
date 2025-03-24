
import React from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, CheckIcon, PlusIcon } from "lucide-react";
import type { TimerControlsProps, ButtonA11yProps } from "@/types/timer/components";
import { logger } from "@/utils/logManager";
import { cn } from "@/lib/utils";

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  isComplete,
  onToggle,
  onComplete,
  onAddTime,
  showAddTime = true,
  size = "md",
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

  const buttonSize = size === "lg" ? "h-14 w-14" : "h-12 w-12";
  const iconSize = size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const gapSize = size === "lg" ? "gap-6" : "gap-4";

  // Handle complete click - ensuring we properly handle the Promise return type
  const handleCompleteClick = async () => {
    if (onComplete) {
      try {
        console.log("TimerControls: Complete button clicked");
        // Explicitly await the Promise returned by onComplete
        await onComplete();
      } catch (error) {
        console.error("Error completing timer:", error);
      }
    }
  };

  // Get button classes based on state
  const getToggleButtonClasses = () => {
    if (isRunning) {
      return "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white shadow-md";
    } else if (isPaused) {
      return "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-md";
    } else {
      return "bg-primary hover:bg-primary/90 text-white shadow-md";
    }
  };

  const toggleButtonLabel = isRunning ? "Pause timer" : isPaused ? "Resume timer" : "Start timer";
  const toggleButtonIcon = isRunning ? <PauseIcon className={iconSize} /> : <PlayIcon className={iconSize} />;

  return (
    <div className={cn(`flex ${gapSize} items-center justify-center`, "transition-opacity duration-300")}>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          buttonSize,
          "rounded-full border-none transition-colors duration-300",
          getToggleButtonClasses()
        )}
        onClick={onToggle}
        data-testid="timer-toggle-button"
        {...toggleButtonA11yProps}
        aria-label={toggleButtonLabel}
      >
        {toggleButtonIcon}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={cn(
          buttonSize,
          "rounded-full bg-primary/90 hover:bg-primary border-none text-white transition-colors duration-300 shadow-md"
        )}
        onClick={handleCompleteClick}
        data-testid="timer-complete-button"
        {...completeButtonA11yProps}
        aria-label="Complete timer"
      >
        <CheckIcon className={iconSize} />
      </Button>

      {showAddTime && onAddTime && (
        <Button
          variant="outline"
          size="icon"
          className={cn(
            buttonSize,
            "rounded-full bg-blue-500 hover:bg-blue-600 border-none text-white transition-colors duration-300 shadow-md"
          )}
          onClick={() => onAddTime(5)}
          data-testid="timer-add-time-button"
          {...addTimeButtonA11yProps}
          aria-label="Add 5 minutes"
        >
          <PlusIcon className={iconSize} />
        </Button>
      )}
    </div>
  );
};
