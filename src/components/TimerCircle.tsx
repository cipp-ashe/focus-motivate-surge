import { memo, useEffect, useRef } from "react";
import { TimerCircleProps } from "../types/timer";
import { prefersReducedMotion } from "../hooks/useTransition";

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
  circumference,
  a11yProps
}: TimerCircleProps) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const prevTimeLeftRef = useRef(timeLeft);

  // Smoothly animate the progress circle and time text
  useEffect(() => {
    if (prefersReducedMotion) {
      if (progressRef.current && textRef.current) {
        progressRef.current.style.strokeDashoffset = `${
          circumference * ((minutes * 60 - timeLeft) / (minutes * 60))
        }`;
        textRef.current.textContent = formatTime(timeLeft);
      }
      return;
    }

    const startValue = prevTimeLeftRef.current;
    const endValue = timeLeft;
    const duration = 1000; // 1 second transition
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentTime1 = startValue - (startValue - endValue) * eased;
      
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = `${
          circumference * ((minutes * 60 - currentTime1) / (minutes * 60))
        }`;
      }

      if (textRef.current) {
        textRef.current.textContent = formatTime(Math.round(currentTime1));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevTimeLeftRef.current = timeLeft;
  }, [timeLeft, minutes, circumference]);

  return (
    <div 
      className={`relative mx-auto ${size === 'large' ? 'w-96 h-96' : 'w-48 h-48'}`}
      {...a11yProps}
    >
      <svg 
        className={`timer-circle ${isRunning ? 'active' : ''}`} 
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          className="text-muted/10 stroke-current"
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          ref={progressRef}
          className={`stroke-current transition-colors duration-300 ${
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
          style={{
            transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 1s linear'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          ref={textRef}
          className={`font-mono font-bold ${size === 'large' ? 'text-6xl' : 'text-3xl'}`}
          style={{
            transition: prefersReducedMotion ? 'none' : 'color 300ms'
          }}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
});

TimerCircle.displayName = 'TimerCircle';