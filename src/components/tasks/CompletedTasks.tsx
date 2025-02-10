
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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="completed-tasks" className="border-none">
        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg transition-colors">
          <div className="flex items-center gap-2 text-foreground">
            <Award className="h-4 w-4 text-primary animate-pulse-slow" />
            <span>Completed Tasks ({tasks.length})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 p-2">
            <div className="rounded-lg border border-border/50 overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border/50">
                    <TableHead className="text-muted-foreground">Task</TableHead>
                    <TableHead className="text-muted-foreground">Completed At</TableHead>
                    <TableHead className="text-muted-foreground">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <>
                      <TableRow key={task.id} className="group border-b border-border/50">
                        <TableCell className="text-foreground">{task.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {task.completedAt ? formatDate(task.completedAt) : "-"}
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
              className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
