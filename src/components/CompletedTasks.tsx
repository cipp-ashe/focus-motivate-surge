import { useState } from "react";
import { Task } from "../types/timer";
import { Card } from "./ui/card";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
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
          <div className="space-y-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Completed Tasks
            </h2>
            <div className="grid grid-cols-2 md:flex md:gap-6 text-sm text-muted-foreground">
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
                className="completed-task-enter completed-task-enter-active p-2 text-sm text-muted-foreground line-through bg-background/30 rounded-lg border border-primary/10 flex justify-between items-center"
              >
                <span>{task.name}</span>
                <div className="flex items-center gap-2">
                  {task.duration && (
                    <span className="text-xs bg-primary/10 px-2 py-1 rounded-full">
                      {task.duration}m
                    </span>
                  )}
                  {task.completedAt && (
                    <span className="text-xs">
                      {new Date(task.completedAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};