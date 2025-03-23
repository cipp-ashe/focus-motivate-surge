
import React from 'react';
import { Task, TaskStatus } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Play, 
  XCircle, 
  Circle,
  ChevronDown
} from 'lucide-react';

interface TaskStatusDropdownProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({
  task,
  onStatusChange
}) => {
  const getStatusDisplay = (status: TaskStatus = 'pending') => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pending', 
          icon: <Circle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-muted text-muted-foreground dark:bg-muted/30'
        };
      case 'started':
        return { 
          label: 'Started', 
          icon: <Clock className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20'
        };
      case 'in-progress':
        return { 
          label: 'In Progress', 
          icon: <Play className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20' 
        };
      case 'delayed':
        return { 
          label: 'Delayed', 
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:bg-orange-500/20' 
        };
      case 'completed':
        return { 
          label: 'Completed', 
          icon: <CheckCircle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-green-500/10 text-green-600 dark:text-green-400 dark:bg-green-500/20' 
        };
      case 'dismissed':
        return { 
          label: 'Dismissed', 
          icon: <XCircle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20' 
        };
      default:
        return { 
          label: 'Pending', 
          icon: <Circle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-muted text-muted-foreground dark:bg-muted/30' 
        };
    }
  };

  const currentStatus = getStatusDisplay(task.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 px-2 text-xs flex items-center gap-1 border-muted/50 dark:border-muted/20",
            currentStatus.class
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {currentStatus.icon}
          {currentStatus.label}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 dark:border-border/10"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem 
          onClick={() => onStatusChange('pending')}
          className="text-xs"
        >
          <Circle className="h-3.5 w-3.5 mr-2" />
          Pending
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange('started')}
          className="text-xs"
        >
          <Clock className="h-3.5 w-3.5 mr-2" />
          Started
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange('in-progress')}
          className="text-xs"
        >
          <Play className="h-3.5 w-3.5 mr-2" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange('delayed')}
          className="text-xs"
        >
          <AlertTriangle className="h-3.5 w-3.5 mr-2" />
          Delayed
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange('completed')}
          className="text-xs text-green-600 dark:text-green-400"
        >
          <CheckCircle className="h-3.5 w-3.5 mr-2" />
          Completed
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange('dismissed')}
          className="text-xs text-red-600 dark:text-red-400"
        >
          <XCircle className="h-3.5 w-3.5 mr-2" />
          Dismissed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
