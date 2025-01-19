import { useState, useCallback } from "react";
import { Timer } from "@/components/Timer";
import { QuoteDisplay } from "@/components/QuoteDisplay";
import { TaskList, Task } from "@/components/TaskList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMER_PRESETS = [
  { value: "900", label: "15 minutes" },
  { value: "1500", label: "25 minutes" },
  { value: "2700", label: "45 minutes" },
  { value: "3600", label: "60 minutes" },
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [duration, setDuration] = useState(1500); // 25 minutes default

  const handleTaskAdd = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleTaskSelect = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleTaskComplete = useCallback(() => {
    if (selectedTask) {
      setCompletedTasks((prev) => [...prev, { ...selectedTask, completed: true }]);
      setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
      setSelectedTask(null);
    }
  }, [selectedTask]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Focus Timer</h1>
          <p className="text-muted-foreground">Stay focused, one task at a time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TaskList
              tasks={tasks}
              completedTasks={completedTasks}
              onTaskAdd={handleTaskAdd}
              onTaskSelect={handleTaskSelect}
            />
          </div>

          <div className="space-y-6">
            {selectedTask ? (
              <>
                <div className="flex justify-center">
                  <Select
                    value={duration.toString()}
                    onValueChange={(value) => setDuration(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMER_PRESETS.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Timer
                  duration={duration}
                  taskName={selectedTask.name}
                  onComplete={handleTaskComplete}
                  onAddTime={() => {}}
                />
              </>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                Select a task to start the timer
              </div>
            )}

            <QuoteDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;