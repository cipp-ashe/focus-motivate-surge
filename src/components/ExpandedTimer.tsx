import { memo, useEffect } from "react";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import { TimerCircle } from "./TimerCircle";
import { TimerControls } from "./TimerControls";
import { QuoteDisplay } from "./QuoteDisplay";
import { ExpandedTimerProps } from "../types/timer";

export const ExpandedTimer = memo(({
  taskName,
  isRunning,
  onClose,
  timerCircleProps,
  timerControlsProps,
  favorites,
  setFavorites,
  a11yProps
}: ExpandedTimerProps) => {
  // Trap focus within modal when expanded
  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRunning) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isRunning, onClose]);

  return (
    <div 
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timer-heading"
      {...a11yProps}
    >
      <div 
        className="absolute inset-0 bg-background"
        aria-hidden="true"
      />
      
      {!isRunning && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-50 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close expanded view"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      
      <div className="flex flex-col items-center max-h-screen overflow-auto py-6 px-4">
        <div className="w-full max-w-xl">
          <Card className="bg-card shadow-lg p-6 border-primary/20">
            <div className="text-center space-y-6">
              <h2 
                id="timer-heading" 
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
              >
                {taskName}
              </h2>
              
              <div 
                className="w-72 h-72 mx-auto"
                aria-live="polite"
              >
                <TimerCircle size="large" {...timerCircleProps} />
              </div>
              
              <TimerControls {...timerControlsProps} size="large" showAddTime />
            </div>
          </Card>
        </div>

        <div 
          className="w-full max-w-xl mt-4"
          aria-label="Motivational quotes"
        >
          <div className="bg-card/30 rounded-lg">
            <QuoteDisplay
              showAsOverlay
              currentTask={taskName}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

ExpandedTimer.displayName = "ExpandedTimer";