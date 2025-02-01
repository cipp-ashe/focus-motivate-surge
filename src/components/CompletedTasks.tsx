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
      <div className="flex justify-between items-center">
        <Accordion type="single" collapsible className="flex-1">
          <AccordionItem value="completed-tasks" className="border-b-0">
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
              <span className="flex items-center gap-2">
                Completed Tasks
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              </span>
            </AccordionTrigger>
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
        <Button
          variant="outline"
          onClick={onSendSummary}
          className="text-primary hover:text-primary ml-4"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Summary
        </Button>
      </div>
    </div>
  );
};