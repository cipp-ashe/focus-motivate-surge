
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

interface CompletedTasksProps {
  tasks: Task[];
  onTasksClear: () => void;
}

export const CompletedTasks = ({ tasks, onTasksClear }: CompletedTasksProps) => {
  if (!tasks.length) return null;

  const handleClearClick = () => {
    onTasksClear();
    toast.success("Completed tasks cleared!");
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="completed-tasks">
        <AccordionTrigger>Completed Tasks ({tasks.length})</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>
                      {task.completedAt ? formatDate(task.completedAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <NotesDialog taskId={task.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
