
import { Button } from "@/components/ui/button";
import { Clock, Plus, Check, Sparkles } from "lucide-react";
import { TimerControlsProps } from "@/types/timer";
import { memo } from "react";
import { TIMER_CONSTANTS } from "@/types/timer";

export const TimerControls = memo(({
  isRunning,
  onToggle,
  onComplete,
  onAddTime,
  isPaused = false,
  showAddTime = false,
  size = "normal",
  toggleButtonA11yProps,
  completeButtonA11yProps,
  addTimeButtonA11yProps,
  pauseTimeLeft = 0,
}: TimerControlsProps) => {
  const iconSize = size === "large" ? "h-5 w-5" : "h-4 w-4";
  const buttonSize = size === "large" ? "px-6 py-3 text-lg" : "px-5 py-2.5";

  const formatPauseTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log('TimerControls rendering:', { isRunning, isPaused, showAddTime });

  const handleAddTimeClick = () => {
    if (onAddTime) {
      onAddTime(TIMER_CONSTANTS.ADD_TIME_MINUTES);
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center w-full">
      <div className="w-full flex justify-center">
        <Button
          onClick={() => {
            console.log('Timer control button clicked:', { isRunning, isPaused });
            if (onToggle) onToggle();
          }}
          className={`bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary ${buttonSize} w-full relative z-10 shadow-md hover:shadow-lg transition-all`}
          {...toggleButtonA11yProps}
        >
          {isRunning ? (
            <>
              <Clock className={`mr-2 ${iconSize}`} />
              Pause
            </>
          ) : (
            <>
              <Sparkles className={`mr-2 ${iconSize}`} />
              {isPaused ? 'Resume' : 'Start'}
              {isPaused && pauseTimeLeft > 0 && (
                <span className="ml-2 text-sm text-foreground">
                  ({formatPauseTime(pauseTimeLeft)})
                </span>
              )}
            </>
          )}
        </Button>
      </div>
      {(isRunning || isPaused) && (
        <div className="w-full flex gap-3">
          <Button
            onClick={onComplete}
            variant="outline"
            className={`border-primary/20 hover:bg-primary/10 ${buttonSize} flex-1 shadow-sm transition-all font-medium`}
            {...completeButtonA11yProps}
          >
            <Check className={`mr-2 ${iconSize}`} />
            {showAddTime ? "Complete" : "Complete Early"}
          </Button>
          {showAddTime && onAddTime && (
            <Button
              onClick={handleAddTimeClick}
              variant="outline"
              className={`border-primary/20 hover:bg-primary/10 ${buttonSize} flex-1 shadow-sm transition-all font-medium`}
              {...addTimeButtonA11yProps}
            >
              <Plus className={`mr-2 ${iconSize}`} />
              Add {TIMER_CONSTANTS.ADD_TIME_MINUTES}m
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

TimerControls.displayName = 'TimerControls';
