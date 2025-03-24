
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from "@/types/tasks";
import { Button } from "@/components/ui/button";
import { 
  Square, Play, X, Check, AlertTriangle, ArrowRight, ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateTaskOperations } from "@/lib/operations/tasks/update";
import { completeTaskOperations } from "@/lib/operations/tasks/complete";
import { deleteTaskOperations } from "@/lib/operations/tasks/delete";
import { toast } from "sonner";

interface StatusDropdownMenuProps {
  task: Task;
  onTaskAction?: (e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, actionType?: string) => void;
}

export const StatusDropdownMenu: React.FC<StatusDropdownMenuProps> = ({ task, onTaskAction }) => {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Listen for refresh events
  useEffect(() => {
    const handleUiRefresh = (event: CustomEvent) => {
      // Reset updating state when we receive a UI refresh event for this task
      if (event.detail?.taskId === task.id) {
        setIsUpdating(false);
      }
    };
    
    window.addEventListener('task-ui-refresh', handleUiRefresh as EventListener);
    
    return () => {
      window.removeEventListener('task-ui-refresh', handleUiRefresh as EventListener);
    };
  }, [task.id]);

  const getStatusInfo = (status: TaskStatus = 'pending') => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Not Started', 
          icon: <Square className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500 dark:text-gray-400 dark:hover:bg-gray-500/10" 
        };
      case 'started':
        return { 
          label: 'Started', 
          icon: <ArrowRight className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10" 
        };
      case 'in-progress':
        return { 
          label: 'In Progress', 
          icon: <Play className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 dark:hover:bg-amber-500/10" 
        };
      case 'delayed':
        return { 
          label: 'Delayed', 
          icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 dark:text-orange-400 dark:hover:bg-orange-500/10" 
        };
      case 'completed':
        return { 
          label: 'Complete', 
          icon: <Check className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-green-500/10 hover:bg-green-500/20 text-green-500 dark:text-green-400 dark:hover:bg-green-500/10" 
        };
      case 'dismissed':
        return { 
          label: 'Dismissed', 
          icon: <X className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 dark:hover:bg-red-500/10" 
        };
      default:
        return { 
          label: 'Not Started', 
          icon: <Square className="h-3.5 w-3.5 mr-1" />, 
          className: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500 dark:text-gray-400 dark:hover:bg-gray-500/10" 
        };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  const handleStatusChange = (e: React.MouseEvent<HTMLElement>, newStatus: TaskStatus) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Close dropdown immediately
    setOpen(false);
    
    if (isUpdating) {
      console.log(`StatusDropdownMenu: Already processing an update, ignoring ${newStatus}`);
      return;
    }
    
    // Skip if the status is the same
    if (task.status === newStatus) {
      console.log(`StatusDropdownMenu: Task ${task.id} already has status ${newStatus}, ignoring`);
      return;
    }
    
    console.log(`StatusDropdownMenu: Changing status of task ${task.id} from ${task.status} to ${newStatus}`);
    
    try {
      setIsUpdating(true);
      
      if (newStatus === 'completed') {
        // For completion, use the dedicated operation
        completeTaskOperations.completeTask(task.id);
      } else if (newStatus === 'dismissed') {
        if (task.relationships?.habitId) {
          // For habit dismissal, use the delete operation with correct options
          deleteTaskOperations.deleteTask(task.id, {
            reason: 'dismissed',
            habitId: task.relationships.habitId,
            date: task.relationships.date || new Date().toDateString()
          });
        } else {
          // For regular dismissal, don't suppress events - let the system handle it
          updateTaskOperations.updateTask(task.id, { 
            status: 'dismissed', 
            dismissedAt: new Date().toISOString()
          });
        }
      } else {
        // For other statuses, use updateTask without suppressing events
        updateTaskOperations.updateTask(task.id, { 
          status: newStatus
        });
      }
      
      // Dispatch custom event to refresh the UI
      window.dispatchEvent(new CustomEvent('task-ui-refresh', { 
        detail: { action: 'update', taskId: task.id, status: newStatus } 
      }));
      
      toast.success(`Task status updated to ${getStatusInfo(newStatus).label}`);
    } catch (error) {
      console.error("Error changing task status:", error);
      toast.error("Failed to update task status");
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 px-2 flex items-center gap-1 text-xs border-border/50 dark:border-border/30 ${statusInfo.className}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-36 bg-popover z-50 shadow-md border border-border/30 dark:border-border/20"
      >
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'pending')}
          className="text-xs cursor-pointer dark:hover:bg-muted/50"
        >
          <Square className="h-3.5 w-3.5 mr-2" />
          Not Started
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'started')}
          className="text-xs cursor-pointer text-blue-500 dark:text-blue-400 dark:hover:bg-muted/50"
        >
          <ArrowRight className="h-3.5 w-3.5 mr-2" />
          Started
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'in-progress')}
          className="text-xs cursor-pointer text-amber-500 dark:text-amber-400 dark:hover:bg-muted/50"
        >
          <Play className="h-3.5 w-3.5 mr-2" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'delayed')}
          className="text-xs cursor-pointer text-orange-500 dark:text-orange-400 dark:hover:bg-muted/50"
        >
          <AlertTriangle className="h-3.5 w-3.5 mr-2" />
          Delayed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'completed')}
          className="text-xs cursor-pointer text-green-600 dark:text-green-400 dark:hover:bg-muted/50"
        >
          <Check className="h-3.5 w-3.5 mr-2" />
          Complete
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'dismissed')}
          className="text-xs cursor-pointer text-red-500 dark:text-red-400 dark:hover:bg-muted/50"
        >
          <X className="h-3.5 w-3.5 mr-2" />
          Dismissed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
