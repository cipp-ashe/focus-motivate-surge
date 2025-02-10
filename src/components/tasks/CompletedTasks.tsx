
import { Task } from "@/types/tasks";
import { formatDate } from "@/utils/timeUtils";
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
import { NotesDialog } from "@/components/notes/components/NotesDialog";
import { toast } from "sonner";
import { Award } from "lucide-react";
import { TaskMetricsRow } from "./TaskMetricsRow";

interface CompletedTasksProps {
  tasks: Task[];
  onTasksClear: () => void;
}

export const CompletedTasks = ({ tasks, onTasksClear }: CompletedTasksProps) => {
  if (!tasks.length) return null;

  const handleClearClick = () => {
    onTasksClear();
    toast.success("Completed tasks cleared!", {
      description: "Keep up the great work! 🎯"
    });
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="completed-tasks" className="border-none">
        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary animate-pulse-slow" />
            <span>Completed Tasks ({tasks.length})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 p-2">
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">Task</TableHead>
                    <TableHead className="font-semibold">Completed At</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Stats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <>
                      <TableRow key={task.id} className="group hover:bg-muted/50">
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {task.completedAt ? formatDate(task.completedAt) : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {task.duration ? `${task.duration} min` : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {task.metrics?.completionStatus || "-"}
                        </TableCell>
                        <TableCell>
                          <NotesDialog 
                            open={false}
                            onOpenChange={() => {}}
                            title="Notes"
                            description="Add notes for this task"
                            actionText="Save"
                            onAction={() => {}}
                          />
                        </TableCell>
                      </TableRow>
                      {task.metrics && (
                        <TaskMetricsRow task={task} />
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>

            <button
              onClick={handleClearClick}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200 group flex items-center gap-2"
            >
              <span className="group-hover:underline">Clear All</span>
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

