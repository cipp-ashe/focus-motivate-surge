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
import { Button } from "./ui/button";
import { Send } from "lucide-react";

interface CompletedTasksProps {
  tasks: Task[];
  onSendSummary: () => void;
}

export const CompletedTasks = ({ tasks, onSendSummary }: CompletedTasksProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-2">
        {/* Header row with completed tasks count */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="completed-tasks" className="border-b-0">
            <div className="flex justify-between items-center bg-card rounded-lg px-4 py-2">
              {/* AccordionTrigger becomes the visible clickable text */}
              <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                Completed Tasks ({tasks.length})
              </AccordionTrigger>
              <Button
                variant="outline"
                onClick={onSendSummary}
                className="text-primary hover:text-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Summary
              </Button>
            </div>
            {/* Expanded content shows the list of completed tasks */}
            <AccordionContent>
              <Table>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="bg-muted/50">
                      <TableCell className="py-2">
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
    </div>
  );
};