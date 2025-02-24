
import { Task } from "@/types/tasks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award } from "lucide-react";
import { TaskMetricsRow } from "./TaskMetricsRow";
import { toast } from "sonner";
import React from 'react';

interface CompletedTasksProps {
  tasks: Task[];
  onTasksClear: () => void;
}

export const CompletedTasks = ({ tasks, onTasksClear }: CompletedTasksProps) => {
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle
    onTasksClear();
    window.dispatchEvent(new Event('tasksUpdated')); // Trigger UI update
    toast.success("Completed tasks cleared!", {
      description: "Keep up the great work! 🎯"
    });
  };

  return (
    <div className="w-full border-t border-border/50">
      <div className="flex-none px-4 py-3">
        <div className="flex items-center gap-2 text-foreground">
          <Award className="h-4 w-4 text-primary" />
          <span className="font-medium">Completed Tasks {tasks.length > 0 && `(${tasks.length})`}</span>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="px-2 pb-4">
          <div className="rounded-lg border border-border/50 overflow-hidden bg-background/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="text-muted-foreground">Task</TableHead>
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <TableRow className="group border-b border-border/50">
                      <TableCell className="line-through text-muted-foreground">{task.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {task.metrics ? `${task.metrics.expectedTime}m` : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {task.metrics?.completionStatus || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {task.metrics ? `${task.metrics.efficiencyRatio.toFixed(1)}%` : "-"}
                      </TableCell>
                    </TableRow>
                    {task.metrics && (
                      <TaskMetricsRow task={task} />
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

            <div className="p-4">
              <button
                onClick={handleClearClick}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center p-4 text-muted-foreground space-y-2">
          <Award className="h-8 w-8 text-muted-foreground/50" />
          <p>No completed tasks</p>
          <p className="text-sm">Complete a task to see it here</p>
        </div>
      )}
    </div>
  );
};
