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
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Task } from "./TaskList";
import { Button } from "./ui/button";
import { Send, Clock, Pause, Quote } from "lucide-react";

interface CompletedTasksProps {
  tasks: Task[];
  onSendSummary: () => void;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${remainingMinutes}m`;
};

export const CompletedTasks = ({ tasks, onSendSummary }: CompletedTasksProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="completed-tasks" className="border-b-0">
            <div className="flex justify-between items-center bg-card rounded-lg px-4 py-2">
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
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Metrics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="bg-muted/50">
                      <TableCell className="py-2">
                        <div className="line-through text-muted-foreground">
                          {task.name}
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(task.duration || 0)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Pause className="w-4 h-4" />
                            <span>{task.metrics?.pauseCount || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Quote className="w-4 h-4" />
                            <span>{task.metrics?.favoriteQuotes || 0}</span>
                          </div>
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