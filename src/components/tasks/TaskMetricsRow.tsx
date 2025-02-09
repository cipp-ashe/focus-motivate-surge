
import { Clock, Pause, Quote, Timer, CheckCircle2, AlertTriangle } from "lucide-react";
import { Task } from "./TaskList";
import { TableCell, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { NoteTags } from "../notes/components/NoteTags";
import { formatDate, formatDuration, getCompletionStatusColor, getCompletionIcon } from "@/utils/taskFormatUtils";

export const TaskMetricsRow = ({ task }: { task: Task }) => {
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
  
  // Map the icon name to the actual component
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

  return (
    <TableRow className="bg-muted/50">
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
          {getStatusIcon()}
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
};
