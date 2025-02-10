
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

  const statusColor = getCompletionStatusColor(metrics.completionStatus);
  const iconName = getCompletionIcon(metrics.completionStatus);
  
  const getStatusIcon = () => {
    switch (iconName) {
      case 'CheckCircle2':
        return <CheckCircle2 className={`w-4 h-4 ${statusColor}`} />;
      case 'Timer':
        return <Timer className={`w-4 h-4 ${statusColor}`} />;
      case 'AlertTriangle':
        return <AlertTriangle className={`w-4 h-4 ${statusColor}`} />;
      default:
        return <Timer className={`w-4 h-4 ${statusColor}`} />;
    }
  };

  const preventPropagation = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  return (
    <TableRow className="bg-muted/30 border-l-2 border-l-primary/20">
      <TableCell className="py-2">
        <div className="text-muted-foreground">
          {task.name}
        </div>
        <TaskTags task={task} preventPropagation={preventPropagation} />
        <div className="text-xs text-muted-foreground mt-1">
          Created: {formatDate(task.createdAt)}
        </div>
      </TableCell>
      <TableCell className="py-2 text-sm text-muted-foreground">
        {metrics.endTime ? formatDate(metrics.endTime) : '-'}
      </TableCell>
      <TableCell className="py-2">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm">Expected: {formatDuration(metrics.expectedTime)}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-sm">Actual: {formatDuration(metrics.actualDuration)}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Timer className="w-3.5 h-3.5" />
            <span className="text-sm">Net: {formatDuration(metrics.netEffectiveTime)}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`${statusColor} text-sm`}>{metrics.completionStatus}</span>
        </div>
        <Badge variant="outline" className="mt-1.5 text-xs">
          {metrics.efficiencyRatio.toFixed(1)}% efficiency
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex flex-col space-y-1.5 text-muted-foreground">
          <div className="flex items-center space-x-1.5">
            <Pause className="w-3.5 h-3.5" />
            <span className="text-sm">Paused: {formatDuration(metrics.pausedTime)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Timer className="w-3.5 h-3.5" />
            <span className="text-sm">Added: {formatDuration(metrics.extensionTime)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Quote className="w-3.5 h-3.5" />
            <span className="text-sm">Quotes: {metrics.favoriteQuotes}</span>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
