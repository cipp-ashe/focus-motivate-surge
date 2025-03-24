
import React, { useState, useEffect, useRef } from 'react';

export interface TimerProps {
  isRunning: boolean;
  isPaused: boolean;
  totalSeconds: number;
  onTimeUpdate: (elapsed: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  isRunning,
  isPaused,
  totalSeconds,
  onTimeUpdate
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Start the timer
  useEffect(() => {
    console.log('Timer state:', { isRunning, isPaused, totalSeconds });
    
    if (isRunning && !isPaused) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set the start time if not already set
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - (pausedTimeRef.current * 1000);
      }
      
      // Set up the interval to update the elapsed time
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSinceStart = (now - startTimeRef.current!) / 1000;
        setElapsedSeconds(elapsedSinceStart);
        onTimeUpdate(elapsedSinceStart);
        
        // Check if we've reached the total duration
        if (elapsedSinceStart >= totalSeconds) {
          clearInterval(intervalRef.current!);
        }
      }, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else if (!isRunning) {
      // Stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // If paused, store the current elapsed time
      if (isPaused && startTimeRef.current !== null) {
        pausedTimeRef.current = (Date.now() - startTimeRef.current) / 1000;
      }
    }
  }, [isRunning, isPaused, totalSeconds, onTimeUpdate]);

  // Reset the timer when the total seconds changes
  useEffect(() => {
    setElapsedSeconds(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [totalSeconds]);

  // Calculate the percentage complete
  const percentComplete = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
  
  return (
    <div className="relative w-32 h-32">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeOpacity="0.1"
          className="dark:opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * percentComplete) / 100}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000 dark:text-purple-500"
        />
      </svg>
    </div>
  );
};
