
import React from 'react';
import { Task } from '@/types/tasks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompletedTaskItemProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export const CompletedTaskItem: React.FC<CompletedTaskItemProps> = ({ 
  task, 
  onDelete 
}) => {
  const isDismissed = !!task.dismissedAt;
  
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all duration-200 animate-fade-in",
      "flex items-center gap-3 group task-item-hover",
      isDismissed 
        ? "bg-orange-50/5 border-orange-200/20 dark:bg-orange-900/5" 
        : "bg-green-50/5 border-green-200/20 dark:bg-green-900/5"
    )}>
      {isDismissed ? (
        <div className="bg-orange-100/10 p-2 rounded-full">
          <XCircle className="h-5 w-5 text-orange-500/90 flex-shrink-0" />
        </div>
      ) : (
        <div className="bg-green-100/10 p-2 rounded-full">
          <CheckCircle className="h-5 w-5 text-green-500/90 flex-shrink-0" />
        </div>
      )}
      
      <div className="flex-1 text-left">
        <p className="font-medium text-foreground">{task.name}</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          {task.relationships?.habitId && (
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-200/30">
              Habit
            </Badge>
          )}
          {task.relationships?.templateId && (
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/30">
              Template
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {isDismissed ? 'Dismissed' : 'Completed'}
          </span>
        </div>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onDelete(task.id)}
        className="h-8 w-8 rounded-full text-destructive opacity-70 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompletedTaskItem;
