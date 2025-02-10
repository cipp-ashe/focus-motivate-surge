
import { Clock, Pause, Quote, Timer, CheckCircle2, AlertTriangle } from "lucide-react";
import { Task } from "@/types/tasks";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { TaskTags } from "./TaskTags";
import { formatDate, formatDuration, getCompletionStatusColor, getCompletionIcon } from "@/utils/taskFormatUtils";

interface TaskMetricsRowProps {
  task: Task;
}

export const TaskMetricsRow = ({ task }: TaskMetricsRowProps) => {
  if (!task.metrics) return null;

  const {
    expectedTime,
    actualDuration,
    pauseCount,
    favoriteQuotes,
    pausedTime,
    extensionTime,
    netEffectiveTime,
    efficiencyRatio,
    completionStatus,
    endTime,
  } = task.metrics;

  const statusColor = getCompletionStatusColor(completionStatus);
  const StatusIcon = getCompletionIcon(completionStatus);
  
  return (
    <TableRow className="bg-muted/30 border-l-2 border-l-primary/20">
      <TableCell colSpan={5} className="py-2">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Time Metrics</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expected: {formatDuration(expectedTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Actual: {formatDuration(actualDuration)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>Net: {formatDuration(netEffectiveTime)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                <span className={`text-sm ${statusColor}`}>{completionStatus}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {efficiencyRatio.toFixed(1)}% efficiency
              </Badge>
              {endTime && (
                <div className="text-xs text-muted-foreground">
                  Completed: {formatDate(endTime)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Details</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Pause className="h-4 w-4" />
                <span>Pauses: {pauseCount} ({formatDuration(pausedTime)})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>Extensions: {formatDuration(extensionTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Quote className="h-4 w-4" />
                <span>Quotes: {favoriteQuotes}</span>
              </div>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
