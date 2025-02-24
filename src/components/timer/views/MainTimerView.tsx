
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
    <div className="relative w-full">
      <div className={`
        relative rounded-lg p-6
        bg-gradient-to-b from-background/40 to-background/60
        backdrop-blur-xl shadow-lg
        border border-primary/5
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:border-primary/10
        ${timerCircleProps.isRunning ? 'bg-background/95' : ''}
      `}>
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
      </div>

      <TimerCompletion
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
        handleAddTimeAndContinue={handleAddTimeAndContinue}
        handleComplete={handleComplete}
      />
    </div>
  );
};
