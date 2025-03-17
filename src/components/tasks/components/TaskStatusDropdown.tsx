
import React from 'react';
import { Task, TaskStatus } from '@/types/tasks';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Check, 
  PlayCircle, 
  Clock, 
  XCircle 
} from 'lucide-react';

interface TaskStatusDropdownProps {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskStatusDropdown: React.FC<TaskStatusDropdownProps> = ({
  task,
  onStatusChange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          aria-label="More options"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onStatusChange('pending')}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
          <span>Pending</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onStatusChange('started')}
        >
          <PlayCircle className="h-4 w-4 text-blue-500" />
          <span>Started</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onStatusChange('in-progress')}
        >
          <Clock className="h-4 w-4 text-yellow-500" />
          <span>In Progress</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onStatusChange('completed')}
        >
          <Check className="h-4 w-4 text-green-500" />
          <span>Complete</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="flex items-center gap-2"
          onClick={() => onStatusChange('dismissed')}
        >
          <XCircle className="h-4 w-4 text-red-500" />
          <span>Dismiss</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
