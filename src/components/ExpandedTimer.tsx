import { memo, useState, useEffect } from "react";
import { FloatingQuotes } from "./FloatingQuotes";
import { Card } from "./ui/card";
import { Minimize2 } from "lucide-react";
import { TimerCircle } from "./TimerCircle";
import { TimerControls } from "./TimerControls";
import { QuoteDisplay } from "./QuoteDisplay";
import { useTransition } from "../hooks/useTransition";
import { useFocusTrap, focusOrder, focusClass } from "../hooks/useFocusTrap";
import { useTimerA11y } from "../hooks/useTimerA11y";
import { ExpandedTimerProps } from "@/types/timer";
import ReactConfetti from "react-confetti";

export const ExpandedTimer = memo(({
  taskName,
  isRunning,
  onClose,
  timerCircleProps,
  timerControlsProps,
  favorites,
  setFavorites,
}: ExpandedTimerProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { isRendered, getTransitionProps } = useTransition({
    isVisible: true,
    options: {
      duration: 300,
      onEnter: () => document.body.style.overflow = "hidden",
      onExit: () => document.body.style.overflow = "auto",
    },
  });

  const { containerRef } = useFocusTrap({
    enabled: isRendered,
    onEscape: onClose,
  });

  const { getTimerA11yProps } = useTimerA11y({
    isRunning,
    timeLeft: timerCircleProps.timeLeft,
    taskName,
    isExpanded: isRendered,
  });

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      if (timerControlsProps.onComplete) {
        timerControlsProps.onComplete();
      }
    }, 2500);
  };

  // Modify timerControlsProps to use our custom complete handler
  const modifiedTimerControlsProps = {
    ...timerControlsProps,
    onComplete: handleComplete,
  };

  if (!isRendered) return null;

  const transitionProps = getTransitionProps();

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timer-heading"
      {...getTimerA11yProps()}
      {...transitionProps}
    >
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          gravity={0.15}
          numberOfPieces={150}
          recycle={false}
          colors={['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD']} // Theme purple colors
          tweenDuration={2500}
        />
      )}
      
      <div
        className="absolute inset-0 bg-background bg-opacity-75 transition-opacity duration-300"
        style={{ opacity: transitionProps.style.opacity }}
        aria-hidden="true"
      />
      
      {/* Floating quotes in background */}
      <FloatingQuotes favorites={favorites} />
      
      <button
        onClick={onClose}
        className={`absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-50 ${focusClass}`}
        aria-label="Minimize timer view"
        {...focusOrder(1)}
      >
        <Minimize2 className="h-6 w-6" />
      </button>

      <div 
        className="flex flex-col items-center justify-center h-full max-h-screen overflow-auto py-6 px-4"
        style={transitionProps.style}
      >
        <div className="w-full max-w-xl">
          <Card 
            className="bg-card shadow-lg p-6 border-primary/20"
            {...focusOrder(2)}
          >
            <div className="flex flex-col items-center min-h-[500px]">
              <h2 
                id="timer-heading" 
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-8"
              >
                {taskName}
              </h2>

              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div 
                  className="relative w-72 h-72"
                  aria-live="polite"
                  {...focusOrder(3)}
                >
                  <TimerCircle size="large" {...timerCircleProps} />
                </div>
                
                <div className="w-full max-w-md" {...focusOrder(4)}>
                  <TimerControls 
                    {...modifiedTimerControlsProps}
                    size="large" 
                    showAddTime 
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div 
          className="w-full max-w-xl mt-8"
          aria-label="Motivational quotes"
          {...focusOrder(5)}
        >
          <QuoteDisplay
            showAsOverlay
            currentTask={taskName}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </div>
      </div>
    </div>
  );
});

ExpandedTimer.displayName = "ExpandedTimer";