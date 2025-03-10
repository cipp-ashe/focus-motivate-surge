
import { memo } from "react";
import { TimerCircle } from "../timer/TimerCircle";
import { TimerCircleProps } from "@/types/timer";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  circleProps: Omit<TimerCircleProps, "size">;
  size: "normal" | "large";
  onClick?: () => void;
  isRunning: boolean;
}

export const TimerDisplay = memo(({
  circleProps,
  size,
  onClick,
  isRunning
}: TimerDisplayProps) => {
  const handleClick = () => {
    if (isRunning && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={cn(
        "rounded-full bg-card/50 shadow-lg transition-all duration-300",
        isRunning ? "cursor-pointer hover:shadow-xl" : "",
        size === "large" ? "p-8" : "p-6"
      )}
      onClick={handleClick}
      onTouchEnd={handleClick}
      role="button"
      tabIndex={0}
    >
      <TimerCircle 
        size={size}
        {...circleProps}
      />
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';
