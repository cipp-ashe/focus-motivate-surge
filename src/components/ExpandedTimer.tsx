import { memo } from "react";
import { Card } from "./ui/card";
import { X } from "lucide-react";
import { TimerCircle } from "./TimerCircle";
import { TimerControls } from "./TimerControls";
import { QuoteDisplay } from "./QuoteDisplay";
import { ExpandedTimerProps } from "../types/timer";
import { useTransition, prefersReducedMotion } from "../hooks/useTransition";
import { useFocusTrap, focusOrder, focusClass } from "../hooks/useFocusTrap";

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
  // Manage transitions
  const { isRendered, getTransitionProps } = useTransition(true, {
    duration: prefersReducedMotion ? 0 : 300,
    onEnter: () => document.body.style.overflow = 'hidden',
    onExit: () => document.body.style.overflow = 'auto'
  });

  // Manage focus trap
  const { containerRef } = useFocusTrap({
    enabled: true,
    onEscape: !isRunning ? onClose : undefined,
  });

  if (!isRendered) return null;

  const transitionProps = getTransitionProps();

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timer-heading"
      {...a11yProps}
      {...transitionProps}
    >
      <div 
        className="absolute inset-0 bg-background transition-opacity duration-300"
        style={{ opacity: transitionProps.style.opacity }}
        aria-hidden="true"
      />
      
      {!isRunning && (
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-50 ${focusClass}`}
          aria-label="Close expanded view"
          {...focusOrder(1)}
        >
          <X className="h-6 w-6" />
        </button>
      )}
      
      <div 
        className="flex flex-col items-center max-h-screen overflow-auto py-6 px-4"
        style={transitionProps.style}
      >
        <div className="w-full max-w-xl">
          <Card 
            className="bg-card shadow-lg p-6 border-primary/20"
            {...focusOrder(2)}
          >
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
                {...focusOrder(3)}
              >
                <TimerCircle size="large" {...timerCircleProps} />
              </div>
              
              <div {...focusOrder(4)}>
                <TimerControls 
                  {...timerControlsProps} 
                  size="large" 
                  showAddTime 
                />
              </div>
            </div>
          </Card>
        </div>

        <div 
          className="w-full max-w-xl mt-4"
          aria-label="Motivational quotes"
          {...focusOrder(5)}
        >
          <div className={`bg-card/30 rounded-lg ${focusClass}`}>
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