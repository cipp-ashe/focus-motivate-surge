import React from 'react';
import { Task, TaskStatus } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  XCircle,
  Circle,
  ChevronDown,
  MinusCircle,
} from 'lucide-react';

interface TaskStatusDropdownProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({ task, onStatusChange }) => {
  const getStatusDisplay = (status: TaskStatus = 'todo') => {
    switch (status) {
      case 'todo':
        return {
          label: 'Todo',
          icon: <Circle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-muted text-muted-foreground',
          menuItemClass: '',
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          icon: <Play className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-amber-500/10 text-amber-500',
          menuItemClass: 'text-amber-500',
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: <CheckCircle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-green-500/10 text-green-500',
          menuItemClass: 'text-green-500',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: <XCircle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-red-500/10 text-red-500',
          menuItemClass: 'text-red-500',
        };
      case 'deferred':
        return {
          label: 'Deferred',
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-orange-500/10 text-orange-500',
          menuItemClass: 'text-orange-500',
        };
      case 'dismissed':
        return {
          label: 'Dismissed',
          icon: <MinusCircle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-purple-500/10 text-purple-500',
          menuItemClass: 'text-purple-500',
        };
      default:
        return {
          label: 'Todo',
          icon: <Circle className="h-3.5 w-3.5 mr-2" />,
          class: 'bg-muted text-muted-foreground',
          menuItemClass: '',
        };
    }
  };

  const currentStatus = getStatusDisplay(task.status);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-7 w-28 px-2 text-xs flex items-center justify-between gap-1 border-border/50',
            currentStatus.class
          )}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div className="flex items-center">
            {currentStatus.icon}
            <span className="whitespace-nowrap">{currentStatus.label}</span>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={5}
        className="w-28 border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={() => onStatusChange('todo')} className="text-xs">
          <Circle className="h-3.5 w-3.5 mr-2" />
          Todo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange('in-progress')}
          className={cn('text-xs', getStatusDisplay('in-progress').menuItemClass)}
        >
          <Play className="h-3.5 w-3.5 mr-2" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange('deferred')}
          className={cn('text-xs', getStatusDisplay('deferred').menuItemClass)}
        >
          <AlertTriangle className="h-3.5 w-3.5 mr-2" />
          Deferred
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange('completed')}
          className={cn('text-xs', getStatusDisplay('completed').menuItemClass)}
        >
          <CheckCircle className="h-3.5 w-3.5 mr-2" />
          Completed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange('cancelled')}
          className={cn('text-xs', getStatusDisplay('cancelled').menuItemClass)}
        >
          <XCircle className="h-3.5 w-3.5 mr-2" />
          Cancelled
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange('dismissed')}
          className={cn('text-xs', getStatusDisplay('dismissed').menuItemClass)}
        >
          <MinusCircle className="h-3.5 w-3.5 mr-2" />
          Dismissed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
