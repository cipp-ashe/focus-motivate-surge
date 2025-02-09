
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
import { Task } from "./tasks/TaskList";
import { Button } from "./ui/button";
import { Send, Clock, Pause, Quote, CheckCircle2, AlertTriangle, Timer } from "lucide-react";
import { Badge } from "./ui/badge";
import { NoteTags } from "./notes/components/NoteTags";
import { Tag } from "@/types/notes";

interface CompletedTasksProps {
  tasks: Task[];
  onSendSummary: () => void;
}

const formatDuration = (seconds: number): string => {
  if (seconds === 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  return `${remainingSeconds}s`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getCompletionStatusColor = (status: string) => {
  switch (status) {
    case 'Completed Early':
      return 'text-green-500';
    case 'Completed On Time':
      return 'text-blue-500';
    case 'Completed Late':
      return 'text-yellow-500';
    default:
      return 'text-muted-foreground';
  }
};

const getCompletionIcon = (status: string) => {
  switch (status) {
    case 'Completed Early':
      return CheckCircle2;
    case 'Completed On Time':
      return Timer;
    case 'Completed Late':
      return AlertTriangle;
    default:
      return Timer;
  }
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
              <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Completion Time</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Metrics</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => {
                      const metrics = task.metrics || {
                        expectedTime: 0,
                        actualDuration: 0,
                        pauseCount: 0,
                        favoriteQuotes: 0,
                        pausedTime: 0,
                        extensionTime: 0,
                        netEffectiveTime: 0,
                        efficiencyRatio: 100,
                        completionStatus: 'Completed On Time',
                        endTime: undefined,
                      };
                      
                      const StatusIcon = getCompletionIcon(metrics.completionStatus);
                      const statusColor = getCompletionStatusColor(metrics.completionStatus);
                      
                      return (
                        <TableRow key={task.id} className="bg-muted/50">
                          <TableCell className="py-2">
                            <div className="line-through text-muted-foreground">
                              {task.name}
                            </div>
                            {task.tags && task.tags.length > 0 && (
                              <div className="mt-1">
                                <NoteTags
                                  tags={task.tags}
                                  onAddTag={() => {}}
                                  onRemoveTag={() => {}}
                                  onTagClick={() => {}}
                                />
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(task.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-sm text-muted-foreground">
                            {metrics.endTime ? formatDate(metrics.endTime) : '-'}
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Expected: {formatDuration(metrics.expectedTime)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Actual: {formatDuration(metrics.actualDuration)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Timer className="w-4 h-4" />
                                <span>Net: {formatDuration(metrics.netEffectiveTime)}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                              <span className={statusColor}>{metrics.completionStatus}</span>
                            </div>
                            <Badge variant="outline" className="mt-1">
                              {metrics.efficiencyRatio.toFixed(1)}% efficiency
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2">
                            <div className="flex flex-col space-y-1 text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Pause className="w-4 h-4" />
                                <span>Paused: {formatDuration(metrics.pausedTime)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Timer className="w-4 h-4" />
                                <span>Added: {formatDuration(metrics.extensionTime)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Quote className="w-4 h-4" />
                                <span>Quotes: {metrics.favoriteQuotes}</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
