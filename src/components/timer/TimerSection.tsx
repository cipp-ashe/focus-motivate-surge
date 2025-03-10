
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
      <Card className="w-full shadow-sm h-full">
        <CardHeader className="border-b border-border/10 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-5 w-5 text-purple-400" />
            Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center justify-center h-[calc(100%-4rem)]">
          <div className="text-center p-6 max-w-md flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center mb-8">
              <TimerIcon className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl text-muted-foreground font-medium mb-2">Select a task to start the timer</h3>
            <p className="text-sm text-muted-foreground/70">
              Choose a task from the list on the right
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const durationInSeconds = selectedTask.duration || 1500;

  return (
    <Card className="w-full shadow-sm h-full">
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
