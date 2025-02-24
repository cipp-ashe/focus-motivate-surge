
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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TimerIcon className="h-4 w-4" />
          <p className="text-sm font-medium">Select a task to start the timer</p>
        </div>
      </div>
    );
  }

  const durationInSeconds = selectedTask.duration || 1500;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
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
  );
};
