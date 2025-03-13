
import React from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TimerExpandedView, TimerExpandedViewRef } from "./TimerExpandedView";
import { MainTimerView } from "./MainTimerView";
import { SoundOption } from "@/types/timer";
import { eventBus } from "@/lib/eventBus";
import { Quote } from "@/types/timer";

interface TimerRendererProps {
  isExpanded: boolean;
  taskName: string;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: TimerStateMetrics;
  showCompletion: boolean;
  internalMinutes: number;
  setInternalMinutes: (minutes: number) => void;
  selectedSound: SoundOption;
  setSelectedSound: (sound: SoundOption) => void;
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

export const TimerRenderer: React.FC<TimerRendererProps> = ({
  isExpanded,
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  showCompletion,
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
  // Don't show anything if the timer is completed and we're in completion view
  if (showCompletion) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main timer view (collapsed state) - hide when fully expanded */}
      <div 
        className={`transition-all duration-500 ${
          isExpanded 
            ? 'opacity-0 pointer-events-none absolute inset-0 z-0 hidden' 
            : 'opacity-100 z-10'
        }`}
      >
        <MainTimerView
          isExpanded={isExpanded}
          setIsExpanded={() => eventBus.emit('timer:expand', { taskName })}
          showCompletion={showCompletion}
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={timerControlsProps}
          metrics={metrics}
          internalMinutes={internalMinutes}
          handleMinutesChange={setInternalMinutes}
          selectedSound={selectedSound}
          setSelectedSound={(sound: SoundOption) => setSelectedSound(sound)}
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
      </div>

      {/* Expanded timer view (fullscreen state) - only rendered when expanded */}
      {isExpanded && (
        <div className="opacity-100 z-[9999] fixed inset-0 w-full h-full bg-background/95 backdrop-blur-sm">
          <TimerExpandedView
            ref={expandedViewRef}
            taskName={taskName}
            timerCircleProps={timerCircleProps}
            timerControlsProps={{
              ...timerControlsProps,
              size: "large"
            }}
            metrics={metrics}
            onClose={() => eventBus.emit('timer:collapse', { taskName, saveNotes: true })}
            onLike={() => {
              const currentFavorites = Array.isArray(metrics.favoriteQuotes) ? metrics.favoriteQuotes : [];
              updateMetrics({ 
                favoriteQuotes: [...currentFavorites, "New quote"]
              });
            }}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        </div>
      )}
    </div>
  );
};
