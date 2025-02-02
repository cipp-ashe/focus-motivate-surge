import { Button } from "../ui/button";
import { Clock, Plus, Check, Sparkles } from "lucide-react";
import { TimerControlsProps } from "@/types/timer";
import { memo } from "react";

export const TimerControls = memo(({
  isRunning,
  onToggle,
  onComplete,
  onAddTime,
  showAddTime = false,
  size = "normal",
  toggleButtonA11yProps,
  completeButtonA11yProps,
  addTimeButtonA11yProps,
}: TimerControlsProps) => {
  const iconSize = size === "large" ? "h-5 w-5" : "h-4 w-4";
  const buttonSize = size === "large" ? "px-6 py-3" : "px-4 py-2";

  return (
    <div className="space-y-3">
      <Button
        onClick={onToggle}
        className={`w-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary ${buttonSize}`}
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
            Start
          </>
        )}
      </Button>
      {isRunning && (
        <div className={showAddTime ? "flex gap-2" : ""}>
          <Button
            onClick={onComplete}
            variant="outline"
            className={`border-primary/20 hover:bg-primary/20 ${showAddTime ? "flex-1" : "w-full"} ${buttonSize}`}
            {...completeButtonA11yProps}
          >
            <Check className={`mr-2 ${iconSize}`} />
            Complete Early
          </Button>
          {showAddTime && onAddTime && (
            <Button
              onClick={onAddTime}
              variant="outline"
              className={`flex-1 border-primary/20 hover:bg-primary/20 ${buttonSize}`}
              {...addTimeButtonA11yProps}
            >
              <Plus className={`mr-2 ${iconSize}`} />
              Add 5m
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

TimerControls.displayName = 'TimerControls';