
import { Timer } from "./Timer";
import { Task } from "@/types/tasks";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { Timer as TimerIcon } from "lucide-react";

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
        <div className="section-header border-b border-border/50">
          <div className="flex items-center gap-2">
            <TimerIcon className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-medium">Timer</h2>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground space-y-2">
          <TimerIcon className="h-8 w-8 text-muted-foreground/50" />
          <p>No task selected</p>
          <p className="text-sm">Select a task to start the timer</p>
        </div>
      </>
    );
  }

  const durationInSeconds = selectedTask.duration || 1500;

  return (
    <>
      <div className="section-header border-b border-border/50">
        <div className="flex items-center gap-2">
          <TimerIcon className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-medium">Timer - {selectedTask.name}</h2>
        </div>
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
