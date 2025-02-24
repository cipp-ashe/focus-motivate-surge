
import { TimerBody } from "../components/TimerBody";
import { TimerCompletion } from "../components/TimerCompletion";
import { TimerStateMetrics } from "@/types/metrics";
import { Quote } from "@/types/timer";
import { TimerExpandedViewRef } from "./TimerExpandedView";

interface MainTimerViewProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  showCompletion: boolean;
  taskName: string;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: TimerStateMetrics;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
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

export const MainTimerView = ({
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
  showConfirmation,
  setShowConfirmation,
  handleAddTimeAndContinue,
  handleComplete,
}: MainTimerViewProps) => {
  return (
    <>
      <TimerBody
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        showCompletion={showCompletion}
        taskName={taskName}
        timerCircleProps={timerCircleProps}
        timerControlsProps={timerControlsProps}
        metrics={metrics}
        internalMinutes={internalMinutes}
        handleMinutesChange={handleMinutesChange}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        testSound={testSound}
        isLoadingAudio={isLoadingAudio}
        updateMetrics={updateMetrics}
        expandedViewRef={expandedViewRef}
        handleCloseTimer={handleCloseTimer}
        favorites={favorites}
        setFavorites={setFavorites}
      />

      <TimerCompletion
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
      />
    </>
  );
};
