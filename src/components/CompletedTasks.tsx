import { useState } from "react";
import { Task } from "../types/timer";
import { Card } from "./ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
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

  if (tasks.length === 0) return null;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Completed Tasks</h2>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div>
                Tasks: <span className="font-mono">{totalTasks}</span>
              </div>
              <div>
                Total Time: <span className="font-mono">{totalTimeSpent}m</span>
              </div>
              <div>
                Average: <span className="font-mono">{averageDuration}m</span>
              </div>
            </div>
          </div>
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

        {isExpanded && (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="completed-task-enter completed-task-enter-active p-2 text-sm text-muted-foreground line-through bg-background/30 rounded-lg border border-primary/10"
              >
                {task.name}
                {task.duration && (
                  <span className="ml-2 text-xs">
                    ({task.duration}m)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};