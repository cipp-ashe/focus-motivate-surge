import { memo, useState, useEffect } from "react";
import { Card } from "./ui/card";
import { TimerCircle } from "./TimerCircle";
import { SoundSelector } from "./SoundSelector";
import { TimerControls } from "./TimerControls";
import { MinutesInput } from "./MinutesInput";
import { CompactTimerProps } from "../types/timer";
import { useFocusTrap, focusOrder, focusClass } from "../hooks/useFocusTrap";
import { CompletionModal } from "./CompletionModal";
import ReactConfetti from "react-confetti";

export const CompactTimer = memo(({
  taskName,
  isRunning,
  minutes,
  timerCircleProps,
  timerControlsProps,
  selectedSound,
  onSoundChange,
  onTestSound,
  onMinutesChange,
  minMinutes,
  maxMinutes,
  a11yProps,
  isLoadingAudio,
  onClick,
}: CompactTimerProps) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
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

  // Handle timer completion when time runs out
  useEffect(() => {
    if (timerCircleProps.timeLeft === 0 && isRunning) {
      console.log("Time is up in compact mode! Showing modal and confetti.");
      handleComplete();
    }
  }, [timerCircleProps.timeLeft, isRunning]);

  const { containerRef } = useFocusTrap({
    enabled: !isRunning,
  });

  const handleComplete = () => {
    console.log("Timer completed in compact mode! Showing modal and confetti.");
    setShowConfetti(true);
    setShowCompletionModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing completion modal in compact mode.");
    setShowConfetti(false);
    setShowCompletionModal(false);
    if (timerControlsProps.onComplete) {
      timerControlsProps.onComplete();
    }
  };

  const handleTimerClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Only handle clicks/touches when the timer is running and we want to expand
    if (isRunning && onClick) {
      e.stopPropagation(); // Allow scrolling while preventing unwanted interactions
      onClick();
    }
  };

  const modifiedTimerControlsProps = {
    ...timerControlsProps,
    onComplete: handleComplete,
  };

  return (
    <div className="w-full overflow-visible">
      {showConfetti && (
        <div className="fixed inset-0 z-40 pointer-events-none">
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
      
      <Card 
        ref={containerRef}
        className="w-full max-w-[600px] mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg p-4 sm:p-6 relative"
        {...a11yProps}
      >
        <div className="text-center space-y-4 sm:space-y-6">
          <h2 
            className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 truncate px-2"
            {...focusOrder(1)}
          >
            {taskName}
          </h2>

          {/* Configuration options only shown when not running */}
          <div className={`overflow-hidden transition-all duration-700 ${
            isRunning ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100 mt-4 sm:mt-6'
          }`}>
            <div className="space-y-4 sm:space-y-6">
              <div {...focusOrder(2)}>
                <MinutesInput
                  minutes={minutes}
                  onMinutesChange={onMinutesChange}
                  minMinutes={minMinutes}
                  maxMinutes={maxMinutes}
                />
              </div>

              <div {...focusOrder(3)}>
                <SoundSelector
                  selectedSound={selectedSound}
                  onSoundChange={onSoundChange}
                  onTestSound={onTestSound}
                  isLoadingAudio={isLoadingAudio}
                />
              </div>
            </div>
          </div>

          <div 
            {...focusOrder(4)}
            className={`${focusClass} ${isRunning ? 'cursor-pointer' : ''}`}
            onClick={handleTimerClick}
            onTouchEnd={handleTimerClick}
          >
            <TimerCircle 
              size="normal" 
              {...timerCircleProps}
            />
          </div>

          <div 
            className="mt-4"
            {...focusOrder(5)}
          >
            <TimerControls {...modifiedTimerControlsProps} />
          </div>
        </div>
      </Card>

      {showCompletionModal && timerControlsProps.metrics && (
        <CompletionModal 
          isOpen={showCompletionModal} 
          onClose={handleCloseModal} 
          metrics={timerControlsProps.metrics} 
          taskName={taskName} 
        />
      )}
    </div>
  );
});

CompactTimer.displayName = 'CompactTimer';