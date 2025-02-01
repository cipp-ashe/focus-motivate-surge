import { memo, useState, useEffect, useCallback } from "react";
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
import { CompletionModal } from "./CompletionModal";
import { toast } from "sonner";

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
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Reset all states
  const resetStates = useCallback(() => {
    console.log("Resetting ExpandedTimer states");
    setShowCompletionModal(false);
    setShowConfetti(false);
  }, []);

  // Reset states when task changes
  useEffect(() => {
    console.log("Task changed in ExpandedTimer:", taskName);
    resetStates();
  }, [taskName, resetStates]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    console.log("Setting up resize listener in ExpandedTimer");
    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log("Cleaning up ExpandedTimer component");
      window.removeEventListener('resize', handleResize);
      resetStates();
    };
  }, [resetStates]);

  const { isRendered, getTransitionProps } = useTransition({
    isVisible: true,
    options: {
      duration: 300,
      onEnter: () => {
        console.log("Entering expanded mode");
        document.body.style.overflow = "hidden";
      },
      onExit: () => {
        console.log("Exiting expanded mode");
        document.body.style.overflow = "auto";
        resetStates();
      },
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

  const handleComplete = useCallback(() => {
    console.log("Timer completed in expanded mode");
    setShowConfetti(true);
    setShowCompletionModal(true);
    toast.success("Timer completed! Great work! 🎉");
  }, []);

  // Handle timer completion
  useEffect(() => {
    if (timerCircleProps.timeLeft === 0 && isRunning) {
      console.log("Time is up in expanded mode");
      handleComplete();
    }
  }, [timerCircleProps.timeLeft, isRunning, handleComplete]);

  const handleCloseModal = useCallback(() => {
    console.log("Closing completion modal in expanded mode");
    resetStates();
    if (timerControlsProps.onComplete) {
      timerControlsProps.onComplete();
    }
  }, [resetStates, timerControlsProps]);

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
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: transitionProps.style.opacity }}
        aria-hidden="true"
      />

      {showConfetti && (
        <div className="fixed inset-0 z-40">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            gravity={0.12}
            numberOfPieces={400}
            recycle={true}
            colors={["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"]}
            tweenDuration={5000}
            wind={0.01}
            initialVelocityY={-2}
          />
        </div>
      )}

      <FloatingQuotes favorites={favorites} />

      <button
        onClick={onClose}
        className={`absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground z-[53] transition-all duration-300 hover:scale-105 ${focusClass}`}
        aria-label="Minimize expanded view"
        {...focusOrder(1)}
      >
        <Minimize2 className="h-6 w-6" />
      </button>

      <div
        className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 py-8 sm:py-12 z-[52] mx-auto w-full max-w-[95%] sm:max-w-[85%] md:max-w-[600px] space-y-12"
        style={transitionProps.style}
      >
        <Card className="w-full bg-card shadow-lg p-6 sm:p-8 border-primary/20" {...focusOrder(2)}>
          <div className="flex flex-col items-center space-y-8">
            <h2 id="timer-heading" className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              {taskName}
            </h2>

            <div className="flex flex-col items-center justify-center gap-16 sm:gap-20 py-8 sm:py-12">
              <div className="relative" aria-live="polite" {...focusOrder(3)}>
                <TimerCircle size="large" {...timerCircleProps} />
              </div>

              <div className="w-full max-w-md px-4" {...focusOrder(4)}>
                <TimerControls {...modifiedTimerControlsProps} size="large" showAddTime />
              </div>
            </div>
          </div>
        </Card>

        <div className="w-full mb-12">
          <QuoteDisplay showAsOverlay currentTask={taskName} favorites={favorites} setFavorites={setFavorites} />
        </div>
      </div>

      {showCompletionModal && timerControlsProps.metrics && (
        <div className="z-50">
          <CompletionModal 
            isOpen={showCompletionModal} 
            onClose={handleCloseModal} 
            metrics={timerControlsProps.metrics} 
            taskName={taskName} 
          />
        </div>
      )}
    </div>
  );
});

ExpandedTimer.displayName = "ExpandedTimer";