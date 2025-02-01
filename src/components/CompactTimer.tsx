import { memo, useState, useCallback } from "react";
import { Card } from "./ui/card";
import { SoundSelector } from "./SoundSelector";
import { MinutesInput } from "./MinutesInput";
import { CompactTimerProps } from "../types/timer";
import { useFocusTrap, focusOrder } from "../hooks/useFocusTrap";
import { CompletionModal } from "./CompletionModal";
import { useWindowSize } from "../hooks/useWindowSize";
import { useTimerEffects } from "../hooks/useTimerEffects";
import { TimerHeader } from "./timer/TimerHeader";
import { TimerConfetti } from "./timer/TimerConfetti";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerControls } from "./timer/TimerControls";
import { TimerMetricsDisplay } from "./timer/TimerMetrics";

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
  const windowSize = useWindowSize();

  const resetStates = useCallback(() => {
    console.log("Resetting CompactTimer states");
    setShowCompletionModal(false);
    setShowConfetti(false);
  }, []);

  const handleComplete = useCallback(() => {
    console.log("Handling timer completion in CompactTimer");
    setShowConfetti(true);
    setShowCompletionModal(true);
  }, []);

  const { handleComplete: timerComplete } = useTimerEffects({
    timeLeft: timerCircleProps.timeLeft,
    isRunning,
    onComplete: handleComplete,
    taskName,
    resetStates,
  });

  const handleCloseModal = useCallback(() => {
    console.log("Closing completion modal in CompactTimer");
    resetStates();
    if (timerControlsProps.onComplete) {
      timerControlsProps.onComplete();
    }
  }, [resetStates, timerControlsProps]);

  const { containerRef } = useFocusTrap({
    enabled: !isRunning,
  });

  const modifiedTimerControlsProps = {
    ...timerControlsProps,
    onComplete: timerComplete,
  };

  return (
    <div className="w-full overflow-visible">
      <TimerConfetti 
        show={showConfetti}
        width={windowSize.width}
        height={windowSize.height}
      />
      
      <Card 
        ref={containerRef}
        className="w-full max-w-[600px] mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg p-4 sm:p-6 relative"
        {...a11yProps}
      >
        <div className="text-center space-y-4 sm:space-y-6">
          <TimerHeader taskName={taskName} focusOrder={1} />

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

          <div {...focusOrder(4)}>
            <TimerDisplay
              circleProps={timerCircleProps}
              size="normal"
              onClick={onClick}
              isRunning={isRunning}
            />
          </div>

          <div {...focusOrder(5)}>
            <TimerControls {...modifiedTimerControlsProps} />
          </div>

          <TimerMetricsDisplay 
            metrics={timerControlsProps.metrics!}
            isRunning={isRunning}
          />
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