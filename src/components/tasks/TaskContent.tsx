
import React from 'react';
import { Task } from '@/types/tasks';
import { formatDistanceToNow } from 'date-fns';
import { Check, Clock, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getHumanReadableDuration } from '@/utils/timeUtils';

interface TaskContentProps {
  task: Task;
  isSelected: boolean;
  onDelete: (e: React.MouseEvent) => void;
  preventPropagation: (e: React.MouseEvent) => void;
  dialogOpeners?: {
    checklist?: ((taskId: string, taskName: string, items: any[]) => void);
    journal?: ((taskId: string, taskName: string, entry: string) => void);
    screenshot?: ((imageUrl: string, taskName: string) => void);
    voicenote?: ((taskId: string, taskName: string) => void);
  };
}

export const TaskContent: React.FC<TaskContentProps> = ({
  task,
  isSelected,
  onDelete,
  preventPropagation,
  dialogOpeners
}) => {
  const formattedDate = task.createdAt 
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : 'recently';

  const taskHasDuration = typeof task.duration === 'number' && task.duration > 0;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className={cn("font-medium text-sm leading-5", 
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.name}
          </h3>
          
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {task.taskType && (
              <Badge variant="outline" className="text-[10px] py-0 h-5">
                {task.taskType}
              </Badge>
            )}
            
            {taskHasDuration && (
              <Badge variant="outline" className="text-[10px] py-0 h-5 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getHumanReadableDuration(task.duration)}
              </Badge>
            )}
            
            {task.relationships?.habitId && (
              <Badge variant="outline" className="text-[10px] py-0 h-5 bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">
                habit
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {isSelected && (
        <>
          <Separator className="my-1" />
          <div className="flex justify-end gap-2 mt-1">
            {task.completed ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs"
                onClick={preventPropagation}
              >
                <Check className="h-3 w-3 mr-1" />
                Completed
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={onDelete}
                >
                  <X className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
