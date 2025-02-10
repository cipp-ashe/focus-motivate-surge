
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
      <div className="text-center text-muted-foreground p-4 sm:p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 flex flex-wrap justify-center items-center">
        Select a task to start the timer
      </div>
    );
  }

  console.log('TimerSection - Rendering with task:', {
    taskId: selectedTask.id,
    duration: selectedTask.duration,
    durationInMinutes: selectedTask.duration ? Math.floor(selectedTask.duration / 60) : 25
  });

  const initialMinutes = selectedTask.duration ? Math.floor(selectedTask.duration / 60) : 25;

  return (
    <Timer
      key={selectedTask.id}
      duration={selectedTask.duration || 1500}
      taskName={selectedTask.name}
      onComplete={onTaskComplete}
      onAddTime={() => {
        console.log("Time added to task:", selectedTask.name);
      }}
      onDurationChange={(minutes) => {
        const seconds = minutes * 60;
        console.log('TimerSection - Converting minutes to seconds:', {
          minutes,
          seconds,
          taskId: selectedTask.id,
          currentDuration: selectedTask.duration
        });
        onDurationChange(seconds);
      }}
      favorites={favorites}
      setFavorites={setFavorites}
    />
  );
};
