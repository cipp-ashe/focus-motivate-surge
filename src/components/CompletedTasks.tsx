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
import { Send, Clock, Pause, Quote, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "./ui/badge";

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

const calculateEfficiency = (originalDuration: number, actualDuration: number): number => {
  if (originalDuration === 0) return 0;
  return Math.round((originalDuration / actualDuration) * 100);
};

const getCompletionStatus = (originalDuration: number, actualDuration: number) => {
  if (actualDuration <= originalDuration) {
    return { icon: CheckCircle2, text: "Completed Early", color: "text-green-500" };
  }
  return { icon: AlertTriangle, text: "Took Longer", color: "text-yellow-500" };
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
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Metrics</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    const metrics = task.metrics || {
                      originalDuration: 0,
                      actualDuration: 0,
                      pauseCount: 0,
                      favoriteQuotes: 0,
                    };
                    
                    const status = getCompletionStatus(
                      metrics.originalDuration,
                      metrics.actualDuration
                    );
                    
                    const StatusIcon = status.icon;
                    
                    return (
                      <TableRow key={task.id} className="bg-muted/50">
                        <TableCell className="py-2">
                          <div className="line-through text-muted-foreground">
                            {task.name}
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>Planned: {formatDuration(metrics.originalDuration)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>Actual: {formatDuration(metrics.actualDuration)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                            <span className={status.color}>{status.text}</span>
                          </div>
                          <Badge variant="outline" className="mt-1">
                            {calculateEfficiency(metrics.originalDuration, metrics.actualDuration)}% efficiency
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Pause className="w-4 h-4" />
                              <span>{metrics.pauseCount || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Quote className="w-4 h-4" />
                              <span>{metrics.favoriteQuotes || 0}</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};