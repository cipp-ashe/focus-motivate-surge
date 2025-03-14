
import { memo, useEffect, useRef } from "react";
import { TimerCircleProps } from "../../types/timer";
import { cn } from "@/lib/utils";

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

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
  a11yProps,
  onClick
}: TimerCircleProps) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const prevTimeLeftRef = useRef(timeLeft);
  const isMountedRef = useRef(true);

  // Smoothly animate the progress circle and time text
  useEffect(() => {
    if (!progressRef.current || !textRef.current || !isMountedRef.current) return;

    if (prefersReducedMotion) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.strokeDashoffset = `${
        circumference * ((minutes * 60 - timeLeft) / (minutes * 60))
      }`;
      textRef.current.textContent = formatTime(timeLeft);
      return;
    }

    const startValue = prevTimeLeftRef.current;
    const endValue = timeLeft;
    const duration = 1000; // 1 second transition
    const startTime = performance.now();

    let animationFrameId: number;
    
    const animate = (currentTime: number) => {
      if (!isMountedRef.current) return;

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

      if (progress < 1 && isMountedRef.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    prevTimeLeftRef.current = timeLeft;

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [timeLeft, minutes, circumference]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
        className={cn(
          "timer-circle transform -rotate-90",
          isRunning && "active"
        )}
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          className="text-muted-foreground/10 dark:text-muted-foreground/5 stroke-current"
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          ref={progressRef}
          className={cn(
            "stroke-current transition-colors",
            isRunning
              ? "text-primary filter drop-shadow-lg"
              : "text-primary/70"
          )}
          strokeWidth="5"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * ((minutes * 60 - timeLeft) / (minutes * 60))}
          style={prefersReducedMotion ? { transition: 'none' } : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          ref={textRef}
          className={cn(
            "font-mono font-bold",
            size === 'large' ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl',
            isRunning ? "text-foreground" : "text-foreground/90"
          )}
          style={prefersReducedMotion ? { transition: 'none' } : undefined}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
});

TimerCircle.displayName = 'TimerCircle';
