
import React from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { Quote, SoundOption, TimerExpandedViewRef } from "@/types/timer";
import { TimerCompactView } from "../views/TimerCompactView";

interface TimerBodyProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  showCompletion: boolean;
  taskName: string;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: TimerStateMetrics;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
  selectedSound: SoundOption;
  setSelectedSound: (sound: SoundOption) => void;
  testSound: () => void;
  isLoadingAudio: boolean;
  updateMetrics: (updates: Partial<TimerStateMetrics>) => void;
  expandedViewRef: React.RefObject<TimerExpandedViewRef>;
  handleCloseTimer: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerBody: React.FC<TimerBodyProps> = ({
  taskName,
  timerCircleProps,
  timerControlsProps,
  metrics,
  internalMinutes,
  handleMinutesChange,
  selectedSound,
  setSelectedSound,
  testSound,
  isLoadingAudio,
  setIsExpanded,
  updateMetrics,
  favorites,
  setFavorites,
}) => {
  const handleLike = () => {
    const currentFavorites = Array.isArray(metrics.favoriteQuotes) ? metrics.favoriteQuotes : [];
    updateMetrics({ 
      favoriteQuotes: [...currentFavorites, "New quote"] 
    });
  };

  return (
    <TimerCompactView
      taskName={taskName}
      timerCircleProps={timerCircleProps}
      timerControlsProps={timerControlsProps}
      metrics={metrics}
      internalMinutes={internalMinutes}
      handleMinutesChange={handleMinutesChange}  // Now using the correct prop name
      selectedSound={selectedSound}
      onSoundChange={setSelectedSound}
      onTestSound={testSound}
      isLoadingAudio={isLoadingAudio}
      onExpand={() => setIsExpanded(true)}
      onLike={handleLike}
      favorites={favorites}
      setFavorites={setFavorites}
    />
  );
};
