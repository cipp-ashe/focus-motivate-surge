
import React from "react";
import { TimerCompactView } from "./TimerCompactView";
import { TimerExpandedView } from "./TimerExpandedView";
import { TimerExpandedViewRef } from "@/types/timer/views";
import { Quote, SoundOption } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";

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
  setSelectedSound: React.Dispatch<React.SetStateAction<SoundOption>>;
  testSound: () => void;
  isLoadingAudio: boolean;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  expandedViewRef: React.RefObject<TimerExpandedViewRef>;
  handleCloseTimer: () => void;
  showConfirmation: boolean;
  setShowConfirmation: (show: boolean) => void;
  handleAddTimeAndContinue: () => void;
  handleComplete: () => Promise<void>;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerRenderer: React.FC<TimerRendererProps> = ({
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
  setFavorites
}) => {
  const handleMinutesChange = (minutes: number) => {
    setInternalMinutes(minutes);
  };

  const handleLike = () => {
    const currentFavorites = metrics.favoriteQuotes || [];
    updateMetrics({
      favoriteQuotes: [...currentFavorites, "New favorite quote"]
    });
  };

  return isExpanded ? (
    <TimerExpandedView
      ref={expandedViewRef}
      taskName={taskName}
      timerCircleProps={timerCircleProps}
      timerControlsProps={timerControlsProps}
      metrics={metrics}
      internalMinutes={internalMinutes}
      handleMinutesChange={handleMinutesChange}
      selectedSound={selectedSound}
      onSoundChange={setSelectedSound}
      onTestSound={testSound}
      isLoadingAudio={isLoadingAudio}
      onCollapse={() => {
        if (expandedViewRef.current) {
          expandedViewRef.current.collapse();
        }
      }}
      onLike={handleLike}
      handleCloseTimer={handleCloseTimer}
      favorites={favorites}
      setFavorites={setFavorites}
    />
  ) : (
    <TimerCompactView
      taskName={taskName}
      timerCircleProps={timerCircleProps}
      timerControlsProps={timerControlsProps}
      metrics={metrics}
      internalMinutes={internalMinutes}
      handleMinutesChange={handleMinutesChange}
      selectedSound={selectedSound}
      onSoundChange={setSelectedSound}
      onTestSound={testSound}
      isLoadingAudio={isLoadingAudio}
      onExpand={() => {
        if (expandedViewRef.current) {
          expandedViewRef.current.expand();
        }
      }}
      onLike={handleLike}
      favorites={favorites}
      setFavorites={setFavorites}
    />
  );
};
