
import React from 'react';
import { Check, ChevronsUpDown, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/tasks'; 
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTaskTypeColor } from '@/hooks/useTaskTypeColor';

interface CompletedTaskItemProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onRestore?: (taskId: string) => void;
  dragHandleProps?: any;
}

const CompletedTaskItem: React.FC<CompletedTaskItemProps> = ({
  task,
  onDelete,
  onEdit,
  onRestore,
  dragHandleProps,
}) => {
  const taskTypeColor = useTaskTypeColor(task.taskType);

  return (
    <Card className="mb-2 border-theme-medium">
      <CardContent className="flex items-center gap-4 p-4">
        {dragHandleProps && (
          <div {...dragHandleProps} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRestore && onRestore(task.id)}
          className="h-8 w-8 p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h3 className="text-sm font-medium line-through">{task.name}</h3>
          <div className="text-xs text-muted-foreground">
            Completed on {format(new Date(task.completedAt || task.createdAt), 'MMM dd, yyyy')}
          </div>
          {task.taskType && (
            <Badge variant="secondary" className="mt-1" style={{ backgroundColor: taskTypeColor }}>
              {task.taskType}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit && onEdit(task)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete && onDelete(task.id)}
          className="text-destructive hover:text-destructive h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompletedTaskItem;
