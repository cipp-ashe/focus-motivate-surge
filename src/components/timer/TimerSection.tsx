
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
      <Card className="shadow-md border-border/20 overflow-hidden">
        <CardHeader className="bg-card/70 border-b border-border/10 py-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-purple-400">
            <TimerIcon className="h-5 w-5 text-purple-400" />
            Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-card/50 py-16">
          <div className="text-center max-w-md mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center mb-8">
              <TimerIcon className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl text-muted-foreground font-medium mb-3">Select a task to start the timer</h3>
            <p className="text-sm text-muted-foreground/70">
              Choose a task from the list above
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const durationInSeconds = selectedTask.duration || 1500;

  return (
    <Card className="shadow-md border-border/20 overflow-hidden">
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
