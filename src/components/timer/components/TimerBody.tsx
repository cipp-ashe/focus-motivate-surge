
import { useCallback } from "react";
import { TimerStateMetrics } from "@/types/metrics";
import { TimerExpandedView, TimerExpandedViewRef } from "../views/TimerExpandedView";
import { TimerCompactView } from "../views/TimerCompactView";
import { Quote } from "@/types/timer";
import { Minimize2 } from "lucide-react";
import { FloatingQuotes } from "../../quotes/FloatingQuotes";

interface TimerBodyProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  showCompletion: boolean;
  taskName: string;
  timerCircleProps: {
    isRunning: boolean;
    timeLeft: number;
    minutes: number;
    circumference: number;
  };
  timerControlsProps: {
    isRunning: boolean;
    onToggle: (fromExpanded?: boolean) => void;
    onComplete: () => void;
    onAddTime?: () => void;
    metrics: TimerStateMetrics;
    showAddTime: boolean;
    size: "normal" | "large";
    pauseTimeLeft?: number;
    isPaused?: boolean;
  };
  metrics: TimerStateMetrics;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
  selectedSound: any;
  setSelectedSound: (sound: any) => void;
  testSound: () => void;
  isLoadingAudio: boolean;
  updateMetrics: any;
  expandedViewRef: React.RefObject<TimerExpandedViewRef>;
  handleCloseTimer: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerBody = ({
  isExpanded,
  setIsExpanded,
  showCompletion,
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
  updateMetrics,
  expandedViewRef,
  handleCloseTimer,
  favorites,
  setFavorites,
}: TimerBodyProps) => {
  const handleLike = useCallback(() => {
    updateMetrics(prev => ({ favoriteQuotes: prev.favoriteQuotes + 1 }));
  }, [updateMetrics]);

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-md transition-opacity duration-300" />
        <FloatingQuotes favorites={favorites} />
        <button
          onClick={handleCloseTimer}
          className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground z-[102] transition-all duration-300 hover:scale-110"
        >
          <Minimize2 className="h-6 w-6" />
        </button>
        <TimerExpandedView
          ref={expandedViewRef}
          taskName={taskName}
          timerCircleProps={timerCircleProps}
          timerControlsProps={{
            ...timerControlsProps,
            size: "large",
            onToggle: () => timerControlsProps.onToggle(true)
          }}
          metrics={metrics}
          onClose={handleCloseTimer}
          onLike={handleLike}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </div>
    );
  }

  return (
    <TimerCompactView
      taskName={taskName}
      timerCircleProps={timerCircleProps}
      timerControlsProps={{...timerControlsProps, size: "normal"}}
      metrics={metrics}
      internalMinutes={internalMinutes}
      onMinutesChange={handleMinutesChange}
      selectedSound={selectedSound}
      onSoundChange={setSelectedSound}
      onTestSound={testSound}
      isLoadingAudio={isLoadingAudio}
      onExpand={() => {
        if (timerCircleProps.isRunning || metrics.isPaused) {
          setIsExpanded(true);
        }
      }}
      onLike={handleLike}
      favorites={favorites}
      setFavorites={setFavorites}
    />
  );
};
