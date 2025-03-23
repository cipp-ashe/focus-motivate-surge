
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

  // Enhanced accessibility attributes
  const a11yAttributes = {
    role: "button",
    tabIndex: 0,
    "aria-label": isRunning ? "Expand timer view" : "Timer display",
    "aria-live": isRunning ? "polite" : "off" as "polite" | "off",
    "aria-atomic": "true" as any,
    onKeyDown: (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && isRunning && onClick) {
        e.preventDefault();
        onClick();
      }
    }
  };

  return (
    <div 
      className={cn(
        "relative group rounded-full bg-card",
        isRunning ? "cursor-pointer" : "",
        size === "large" ? "p-8" : "p-6"
      )}
      onClick={handleClick}
      onTouchEnd={handleClick}
      {...a11yAttributes}
    >
      <TimerCircle 
        size={size}
        {...circleProps}
      />
      
      {isRunning && onClick && (
        <div 
          className="absolute top-2 right-2"
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      )}
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';
