import { memo } from "react";
import { Button } from "./ui/button";
import { Clock, Plus, Check, Sparkles } from "lucide-react";
import { TimerControlsProps } from "../types/timer";

export const TimerControls = memo(({
  isRunning,
  onToggle,
  onComplete,
  onAddTime,
  showAddTime = false,
  size = "normal"
}: TimerControlsProps) => {
  const iconSize = size === "large" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div className="space-y-3">
      <Button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
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
            className={`border-primary/20 hover:bg-primary/20 ${showAddTime ? "flex-1" : "w-full"}`}
          >
            <Check className={`mr-2 ${iconSize}`} />
            {showAddTime ? "Complete" : "Complete Early"}
          </Button>
          {showAddTime && onAddTime && (
            <Button
              onClick={onAddTime}
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/20"
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