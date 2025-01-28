import { memo } from "react";
import { TimerCircleProps } from "../types/timer";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TimerCircle = memo(({
  size,
  isRunning,
  timeLeft,
  minutes,
  circumference
}: TimerCircleProps) => (
  <div className={`relative mx-auto ${size === 'large' ? 'w-96 h-96' : 'w-48 h-48'}`}>
    <svg className={`timer-circle ${isRunning ? 'active' : ''}`} viewBox="0 0 100 100">
      <circle
        className="text-muted/10 stroke-current"
        strokeWidth="4"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
      />
      <circle
        className={`stroke-current transition-all duration-1000 ${
          isRunning
            ? 'text-primary filter drop-shadow-[0_0_6px_rgba(168,85,247,0.3)]'
            : 'text-primary/50'
        }`}
        strokeWidth="4"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * ((minutes * 60 - timeLeft) / (minutes * 60))}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className={`font-mono font-bold ${size === 'large' ? 'text-6xl' : 'text-3xl'}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  </div>
));

TimerCircle.displayName = 'TimerCircle';