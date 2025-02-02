import { useState } from "react";
import { Task } from "../types/timer";
import { Card } from "./ui/card";
import { CheckCircle2, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "./ui/button";

interface CompletedTasksProps {
  tasks: Task[];
}

export const CompletedTasks = ({ tasks }: CompletedTasksProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate metrics
  const totalTasks = tasks.length;
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.duration || 25), 0);
  const averageDuration = totalTasks > 0 ? Math.round(totalTimeSpent / totalTasks) : 0;
  const totalCompletedToday = tasks.filter(task => {
    const taskDate = new Date(task.completedAt || Date.now());
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  }).length;

  if (tasks.length === 0) return null;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              Completed Tasks ({totalTasks})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-primary/20"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="text-primary hover:bg-primary/20 gap-2"
          >
            <Send className="h-4 w-4" />
            Send Summary
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-4 px-2 py-1 text-sm text-muted-foreground">
              <div>Task</div>
              <div>Time</div>
              <div>Status</div>
              <div>Metrics</div>
            </div>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-4 gap-4 p-2 text-sm bg-background/30 rounded-lg border border-primary/10"
              >
                <div className="line-through">{task.name}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Planned:</span>
                    <span>{task.duration || 0}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Actual:</span>
                    <span>{task.duration || 0}m</span>
                  </div>
                </div>
                <div>
                  <div className="text-emerald-500">Completed Early</div>
                  <div className="text-sm text-muted-foreground">
                    0% efficiency
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono">0</span>
                  <span className="font-mono">0</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:flex md:gap-6 text-sm text-muted-foreground mt-2">
          <div>
            Total Tasks: <span className="font-mono">{totalTasks}</span>
          </div>
          <div>
            Today: <span className="font-mono">{totalCompletedToday}</span>
          </div>
          <div>
            Total Time: <span className="font-mono">{totalTimeSpent}m</span>
          </div>
          <div>
            Average: <span className="font-mono">{averageDuration}m</span>
          </div>
        </div>
      </div>
    </Card>
  );
};