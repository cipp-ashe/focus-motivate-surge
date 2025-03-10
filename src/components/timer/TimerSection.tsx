
import { Timer } from "./Timer";
import { Task } from "@/types/tasks";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { Timer as TimerIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="w-full shadow-sm mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <TimerIcon className="h-5 w-5 text-primary" />
            Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
            <div className="text-center p-6">
              <TimerIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Select a task to start the timer</p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                Choose a task from the list on the right
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const durationInSeconds = selectedTask.duration || 1500;

  return (
    <Card className="w-full shadow-sm mb-4">
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
    </Card>
  );
};
