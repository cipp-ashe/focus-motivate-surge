
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Plus, List, X, Send } from "lucide-react";
import type { Task } from "@/types/tasks";
import { ImportTasksButton } from "./ImportTasksButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { eventBus } from "@/lib/eventBus";
import { toast } from "sonner";

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
  onTasksAdd?: (tasks: Task[]) => void;
}

const generateId = () => {
  return crypto.randomUUID();
};

const DEFAULT_DURATION = 1500; // 25 minutes in seconds

export const TaskInput = ({ onTaskAdd, onTasksAdd }: TaskInputProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (isBulkAdd) {
        const taskLines = newTaskName.split('\n').filter(task => task.trim());
        console.log(`TaskInput: Creating ${taskLines.length} tasks from bulk add`);
        
        const tasks: Task[] = taskLines.map(taskLine => {
          const [taskName, durationStr] = taskLine.split(',').map(s => s.trim());
          return {
            id: generateId(),
            name: taskName,
            completed: false,
            duration: durationStr 
              ? Math.min(Math.max(parseInt(durationStr), 1), 60) * 60 
              : DEFAULT_DURATION,
            createdAt: new Date().toISOString(),
          };
        });
        
        // Use the batch add method if available
        if (onTasksAdd) {
          onTasksAdd(tasks);
        } else {
          // Add tasks with staggered timing
          tasks.forEach((task, index) => {
            setTimeout(() => {
              // Emit event directly for better reliability
              eventBus.emit('task:create', task);
            }, index * 100); // Add 100ms between tasks
          });
          
          // Force update after all tasks should have been added
          setTimeout(() => {
            toast.success(`Added ${tasks.length} tasks`);
            window.dispatchEvent(new Event('force-task-update'));
          }, tasks.length * 100 + 300);
        }
      } else {
        // Create a single task
        const task: Task = {
          id: generateId(),
          name: newTaskName.trim(),
          completed: false,
          duration: DEFAULT_DURATION,
          createdAt: new Date().toISOString(),
        };
        
        // Use callback for single task
        onTaskAdd(task);
        console.log("TaskInput: Created single task:", task);
      }
    } catch (error) {
      console.error("Error creating tasks:", error);
      toast.error("Failed to create tasks");
    } finally {
      // Reset state
      setNewTaskName("");
      setIsProcessing(false);
    }
  };

  const handleTasksImport = (importedTasks: Omit<Task, 'id' | 'createdAt'>[]) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      console.log(`TaskInput: Importing ${importedTasks.length} tasks`);
      
      const tasks: Task[] = importedTasks.map(taskData => ({
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }));
      
      // Use the batch add method if available
      if (onTasksAdd && tasks.length > 1) {
        onTasksAdd(tasks);
      } else {
        // Add tasks with staggered timing
        tasks.forEach((task, index) => {
          setTimeout(() => {
            // Emit event directly
            eventBus.emit('task:create', task);
          }, index * 100);
        });
        
        // Force update after all tasks should have been added
        setTimeout(() => {
          toast.success(`Imported ${tasks.length} tasks`);
          window.dispatchEvent(new Event('force-task-update'));
        }, tasks.length * 100 + 300);
      }
    } catch (error) {
      console.error("Error importing tasks:", error);
      toast.error("Failed to import tasks");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setNewTaskName("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-start gap-2">
        <div className="flex-1 relative">
          {isBulkAdd ? (
            <Textarea
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add multiple tasks (one per line)...&#10;Task name, duration (optional)&#10;Example:&#10;Read book, 30&#10;Write code"
              className="min-h-[100px] resize-y pr-8 bg-card/50 border-primary/10 focus:border-primary/20 shadow-sm"
              disabled={isProcessing}
            />
          ) : (
            <Input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add a new task..."
              className="pr-8 bg-card/50 border-primary/10 focus:border-primary/20 shadow-sm h-12"
              disabled={isProcessing}
            />
          )}
          {newTaskName && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200"
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <ImportTasksButton onTasksImport={handleTasksImport} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="border-primary/20 hover:bg-primary/5" disabled={isProcessing}>
                <List className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-lg border-primary/10">
              <DropdownMenuItem onClick={() => setIsBulkAdd(false)}>
                Single Task Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsBulkAdd(true)}>
                Bulk Add Mode
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            type="submit" 
            variant="default" 
            size="icon" 
            disabled={!newTaskName.trim() || isProcessing}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300"
          >
            {isProcessing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
