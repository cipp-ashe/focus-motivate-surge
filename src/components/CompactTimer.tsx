import { memo, useState } from "react";
import { Card } from "./ui/card";
import { TimerCircle } from "./TimerCircle";
import { SoundSelector } from "./SoundSelector";
import { TimerControls } from "./TimerControls";
import { MinutesInput } from "./MinutesInput";
import { CompactTimerProps } from "../types/timer";
import { useFocusTrap, focusOrder, focusClass } from "../hooks/useFocusTrap";
import { CompletionModal } from "./CompletionModal";

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
  const { containerRef } = useFocusTrap({
    enabled: !isRunning,
  });

  const handleComplete = () => {
    console.log("Timer completed in compact mode! Showing modal.");
    setShowCompletionModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing completion modal in compact mode.");
    setShowCompletionModal(false);
    if (timerControlsProps.onComplete) {
      timerControlsProps.onComplete();
    }
  };

  const modifiedTimerControlsProps = {
    ...timerControlsProps,
    onComplete: handleComplete,
  };

  return (
    <Card 
      ref={containerRef}
      className={`mx-auto bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg p-4 sm:p-6 ${focusClass}`}
      {...a11yProps}
    >
      <div className="text-center space-y-4 sm:space-y-6">
        <h2 
          className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 truncate px-2"
          {...focusOrder(1)}
        >
          {taskName}
        </h2>

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
          className={focusClass}
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

      {showCompletionModal && timerControlsProps.metrics && (
        <CompletionModal 
          isOpen={showCompletionModal} 
          onClose={handleCloseModal} 
          metrics={timerControlsProps.metrics} 
          taskName={taskName} 
        />
      )}
    </Card>
  );
});

CompactTimer.displayName = 'CompactTimer';