
import { memo } from "react";
import { TimerCircle } from "../timer/TimerCircle";
import { TimerCircleProps } from "@/types/timer";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";

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
    "aria-atomic": "true" as any, // Fix the type error by using 'any' for now
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
        "relative group rounded-full bg-card shadow-xl transition-all duration-300 border border-primary/10",
        isRunning ? "cursor-pointer hover:shadow-2xl" : "",
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
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        >
          <Maximize2 className="h-5 w-5 text-primary" />
        </div>
      )}
    </div>
  );
});

TimerDisplay.displayName = 'TimerDisplay';
