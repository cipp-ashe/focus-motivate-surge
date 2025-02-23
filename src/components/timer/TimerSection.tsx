
import { Timer } from "./Timer";
import { Task } from "@/types/tasks";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";

interface TimerSectionProps {
  selectedTask: Task | null;
  onTaskComplete: (metrics: TimerStateMetrics) => void;
  onDurationChange: (seconds: number) => void;
  favorites: Quote[];
  setFavorites: (favorites: Quote[]) => void;
}

export const TimerSection = ({
  selectedTask,
  onTaskComplete,
  onDurationChange,
  favorites,
  setFavorites,
}: TimerSectionProps) => {
  if (!selectedTask) {
    return (
      <>
        <div className="section-header">
          <h2 className="text-lg font-semibold">Timer</h2>
        </div>
        <div className="scrollable-content">
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center text-muted-foreground p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 w-full max-w-xl mx-4">
              Select a task to start the timer
            </div>
          </div>
        </div>
      </>
    );
  }

  const durationInSeconds = selectedTask.duration || 1500;

  return (
    <>
      <div className="section-header">
        <h2 className="text-lg font-semibold">Timer - {selectedTask.name}</h2>
      </div>
      <div className="scrollable-content flex items-center justify-center">
        <Timer
          key={`timer-${selectedTask.id}-${durationInSeconds}`}
          duration={durationInSeconds}
          taskName={selectedTask.name}
          onComplete={onTaskComplete}
          onAddTime={() => {
            console.log("Time added to task:", selectedTask.name);
          }}
          onDurationChange={(minutes) => {
            const seconds = minutes * 60;
            onDurationChange(seconds);
          }}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      </div>
    </>
  );
};
