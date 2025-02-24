
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
import { useTaskContext } from "@/contexts/TaskContext";

interface CompletedTasksProps {
  tasks: Task[];
  onTasksClear: () => void;
}

export const CompletedTasks = ({ tasks, onTasksClear }: CompletedTasksProps) => {
  if (!tasks.length) return null;

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion toggle
    onTasksClear();
    toast.success("Completed tasks cleared!", {
      description: "Keep up the great work! 🎯"
    });
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="completed-tasks" className="border-none">
        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg transition-colors">
          <div className="flex items-center gap-2 text-foreground">
            <Award className="h-4 w-4 text-primary animate-pulse-slow" />
            <span>Completed Tasks ({tasks.length})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2 pb-4 px-2">
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
            </div>

            <button
              onClick={handleClearClick}
              className="mt-4 text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
