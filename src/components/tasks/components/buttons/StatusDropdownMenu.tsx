
import React, { useState } from 'react';
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
  
  // Get status label and colors
  const getStatusInfo = (status: TaskStatus = 'pending') => {
    switch (status) {
      case 'pending':
        return { label: 'Not Started', icon: <Square className="h-3.5 w-3.5 mr-1" />, className: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500" };
      case 'started':
        return { label: 'Started', icon: <ArrowRight className="h-3.5 w-3.5 mr-1" />, className: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-500" };
      case 'in-progress':
        return { label: 'In Progress', icon: <Play className="h-3.5 w-3.5 mr-1" />, className: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-500" };
      case 'delayed':
        return { label: 'Delayed', icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />, className: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-500" };
      case 'completed':
        return { label: 'Complete', icon: <Check className="h-3.5 w-3.5 mr-1" />, className: "bg-green-500/10 hover:bg-green-500/20 text-green-500" };
      case 'dismissed':
        return { label: 'Dismissed', icon: <X className="h-3.5 w-3.5 mr-1" />, className: "bg-red-500/10 hover:bg-red-500/20 text-red-500" };
      default:
        return { label: 'Not Started', icon: <Square className="h-3.5 w-3.5 mr-1" />, className: "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500" };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  // Properly handle status changes by directly using the operations
  const handleStatusChange = (e: React.MouseEvent<HTMLElement>, newStatus: TaskStatus) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Don't update if already updating
    if (isUpdating) return;
    
    // Don't update if the status is already the same
    if (task.status === newStatus) {
      console.log(`StatusDropdownMenu: Task ${task.id} already has status ${newStatus}, ignoring`);
      setOpen(false);
      return;
    }
    
    console.log(`StatusDropdownMenu: Changing status of task ${task.id} from ${task.status} to ${newStatus}`);
    
    try {
      // First close the dropdown to improve UI feedback
      setOpen(false);
      setIsUpdating(true);
      
      // Handle different status types with appropriate operations
      if (newStatus === 'completed') {
        // For completed status, use completeTaskOperations
        completeTaskOperations.completeTask(task.id);
      } else if (newStatus === 'dismissed') {
        // For dismissed status, use specialized handler based on task type
        if (task.relationships?.habitId) {
          // Habit-related tasks need special dismissal
          deleteTaskOperations.deleteTask(task.id, {
            isDismissal: true,
            habitId: task.relationships.habitId,
            date: task.relationships.date || new Date().toDateString(),
            reason: 'dismissed'
          });
        } else {
          // For regular tasks, use direct update with dismissal fields
          updateTaskOperations.updateTask(task.id, { 
            status: 'dismissed', 
            dismissedAt: new Date().toISOString() 
          });
        }
      } else {
        // For other status values, use direct update
        updateTaskOperations.updateTask(task.id, { status: newStatus });
      }
      
      // Show a success toast with the updated status
      toast.success(`Task status updated to ${getStatusInfo(newStatus).label}`);
    } catch (error) {
      console.error("Error changing task status:", error);
      toast.error("Failed to update task status");
    } finally {
      // Reset updating state after a short delay
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`h-7 px-2 flex items-center gap-1 text-xs ${statusInfo.className}`}
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
        className="w-36 bg-popover z-50 shadow-md border border-border/30"
      >
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'pending')}
          className="text-xs cursor-pointer"
        >
          <Square className="h-3.5 w-3.5 mr-2" />
          Not Started
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'started')}
          className="text-xs cursor-pointer"
        >
          <ArrowRight className="h-3.5 w-3.5 mr-2" />
          Started
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'in-progress')}
          className="text-xs cursor-pointer"
        >
          <Play className="h-3.5 w-3.5 mr-2" />
          In Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'delayed')}
          className="text-xs cursor-pointer"
        >
          <AlertTriangle className="h-3.5 w-3.5 mr-2" />
          Delayed
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'completed')}
          className="text-xs cursor-pointer text-green-600"
        >
          <Check className="h-3.5 w-3.5 mr-2" />
          Complete
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => handleStatusChange(e, 'dismissed')}
          className="text-xs cursor-pointer text-red-500"
        >
          <X className="h-3.5 w-3.5 mr-2" />
          Dismissed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
