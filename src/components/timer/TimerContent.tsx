
import React from "react";
import { Timer as TimerIcon } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { TimerStateMetrics } from "@/types/metrics";
import { CompletionView } from "./views/CompletionView";
import { TimerRenderer } from "./views/TimerRenderer";
import { TimerExpandedViewRef } from "@/types/timer/views";
import { Quote, SoundOption } from "@/types/timer/models";

interface TimerContentProps {
  // Refs
  expandedViewRef: React.RefObject<TimerExpandedViewRef>;
  
  // State
  isExpanded: boolean;
  selectedSound: SoundOption;
  setSelectedSound: React.Dispatch<React.SetStateAction<SoundOption>>;
  showCompletion: boolean;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  completionMetrics: TimerStateMetrics | null;
  internalMinutes: number;
  setInternalMinutes: (minutes: number) => void;
  metrics: TimerStateMetrics;
  isRunning: boolean;
  
  // Handlers
  timerHandlers: any;
  
  // Props generators
  getTimerCircleProps: () => any;
  getTimerControlsProps: () => any;
  
  // Utility functions
  testSound: () => void;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  isLoadingAudio: boolean;
  
  // External props
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  taskName: string;
}

export const TimerContent: React.FC<TimerContentProps> = (props) => {
  // Destructure props for clarity
  const {
    showCompletion,
    completionMetrics,
    isExpanded,
    taskName,
    metrics,
    internalMinutes,
    setInternalMinutes,
    selectedSound,
    setSelectedSound,
    testSound,
    isLoadingAudio,
    updateMetrics,
    expandedViewRef,
    favorites,
    setFavorites,
    showConfirmation,
    setShowConfirmation,
    timerHandlers,
    getTimerCircleProps,
    getTimerControlsProps,
    isRunning,
  } = props;

  // Extract handlers with safer destructuring
  // If timerHandlers is undefined or missing properties, provide fallback functions
  const handleCloseCompletion = timerHandlers?.handleCloseCompletion || (() => console.log('Close completion'));
  const handleCloseTimer = timerHandlers?.handleCloseTimer || (() => console.log('Close timer'));
  const handleAddTimeAndContinue = timerHandlers?.handleAddTimeAndContinue || (() => console.log('Add time and continue'));
  const handleComplete = timerHandlers?.handleComplete || (async () => Promise.resolve());

  // Get props objects - ensure they're functions before calling them
  const timerCircleProps = typeof getTimerCircleProps === 'function' ? getTimerCircleProps() : {};
  const timerControlsProps = typeof getTimerControlsProps === 'function' ? getTimerControlsProps() : {};

  // Show completion view if timer is complete and we have completion metrics
  if (showCompletion && completionMetrics) {
    return (
      <>
        <div className="bg-card/70 border-b border-border/10 p-3">
          <h3 className="text-base font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-4 w-4 text-purple-400" />
            Timer Complete
          </h3>
        </div>
        <CompletionView metrics={completionMetrics} onComplete={handleCloseCompletion} />
      </>
    );
  }

  return (
    <>
      <TimerRenderer
        isExpanded={isExpanded}
        taskName={taskName}
        timerCircleProps={timerCircleProps}
        timerControlsProps={timerControlsProps}
        metrics={metrics}
        showCompletion={showCompletion}
        internalMinutes={internalMinutes}
        setInternalMinutes={setInternalMinutes}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        testSound={testSound}
        isLoadingAudio={isLoadingAudio}
        updateMetrics={updateMetrics}
        expandedViewRef={expandedViewRef}
        handleCloseTimer={handleCloseTimer}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
        favorites={favorites}
        setFavorites={setFavorites}
      />
    </>
  );
};
