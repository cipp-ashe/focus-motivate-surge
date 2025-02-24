
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
        relative rounded-lg p-8
        ${timerCircleProps.isRunning 
          ? 'bg-background/95 shadow-lg' 
          : 'bg-gradient-to-br from-purple-500/10 via-background/60 to-background/80'}
        backdrop-blur-xl
        border border-purple-500/10
        transition-all duration-500 ease-in-out
        hover:border-purple-500/20
        hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
        group
      `}>
        <div className={`
          absolute inset-0 rounded-lg
          bg-gradient-to-br from-purple-500/5 via-transparent to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
        `} />
        
        <div className="relative z-10">
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
