
import React from "react";
import { Timer as TimerIcon } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { TimerExpandedViewRef, Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { CompletionView } from "./views/CompletionView";
import { TimerRenderer } from "./views/TimerRenderer";

interface TimerContentProps {
  showCompletion: boolean;
  completionMetrics: TimerStateMetrics | null;
  handleCloseCompletion: () => void;
  isExpanded: boolean;
  taskName: string;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: TimerStateMetrics;
  internalMinutes: number;
  setInternalMinutes: (minutes: number) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
  testSound: () => void;
  isLoadingAudio: boolean;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  expandedViewRef: React.RefObject<TimerExpandedViewRef>;
  handleCloseTimer: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  handleAddTimeAndContinue: () => void;
  handleComplete: () => void;
}

export const TimerContent: React.FC<TimerContentProps> = ({
  showCompletion,
  completionMetrics,
  handleCloseCompletion,
  isExpanded,
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  internalMinutes,
  setInternalMinutes,
  selectedSound,
  setSelectedSound,
  testSound,
  isLoadingAudio,
  updateMetrics,
  expandedViewRef,
  handleCloseTimer,
  favorites,
  setFavorites,
  showConfirmation,
  setShowConfirmation,
  handleAddTimeAndContinue,
  handleComplete,
}) => {
  // Show completion view if timer is complete
  if (showCompletion && completionMetrics) {
    return (
      <>
        <CardHeader className="bg-card/70 border-b border-border/10 py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-5 w-5 text-purple-400" />
            Timer Complete
          </CardTitle>
        </CardHeader>
        <CompletionView metrics={completionMetrics} onComplete={handleCloseCompletion} />
      </>
    );
  }

  return (
    <>
      <CardHeader className="bg-card/70 border-b border-border/10 py-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
          <TimerIcon className="h-5 w-5 text-purple-400" />
          Timer
        </CardTitle>
      </CardHeader>
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
        favorites={favorites}
        setFavorites={setFavorites}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
      />
    </>
  );
};
