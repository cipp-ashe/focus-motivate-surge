
import { memo } from "react";
import { TimerCircleProps } from "../../types/timer";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TimerCircle = memo(({
  size = 'normal',
  isRunning,
  timeLeft,
  minutes,
  circumference = 282.74, // Default value based on r=45
  a11yProps,
  onClick
}: TimerCircleProps) => {
  const dashOffset = circumference * ((minutes * 60 - timeLeft) / (minutes * 60));

  const sizeClasses = size === 'large' 
    ? 'w-64 h-64 sm:w-72 sm:h-72' 
    : 'w-52 h-52 sm:w-56 sm:h-56';

  return (
    <div 
      className={cn(
        "relative mx-auto",
        sizeClasses,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      {...a11yProps}
    >
      <svg 
        className="timer-circle transform -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          className="dark:text-slate-800 text-slate-200 stroke-current"
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        
        {/* Progress circle */}
        <circle
          className="text-primary stroke-current"
          strokeWidth="5"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={cn(
            "font-mono font-bold",
            size === 'large' ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl',
            isRunning ? "text-foreground" : "text-foreground/90"
          )}
        >
          {formatTime(timeLeft)}
        </span>
        
        <span className="text-xs text-muted-foreground mt-2 font-medium">
          {isRunning ? "FOCUS TIME" : "READY"}
        </span>
      </div>
    </div>
  );
});

TimerCircle.displayName = 'TimerCircle';
