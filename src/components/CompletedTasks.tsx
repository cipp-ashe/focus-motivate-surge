import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "./ui/table";
import { Task } from "./TaskList";

interface CompletedTasksProps {
  tasks: Task[];
}

export const CompletedTasks = ({ tasks }: CompletedTasksProps) => {
  if (tasks.length === 0) return null;

  return (
    <div>
      <div className="text-sm text-muted-foreground mt-2">
        Completed Tasks: {tasks.length}
      </div>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="completed-tasks">
          <AccordionTrigger className="text-sm font-medium">
            View Completed Tasks
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="bg-muted/50">
                    <TableCell className="py-3">
                      <div className="line-clamp-2 line-through text-muted-foreground">
                        {task.name}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};