
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Plus, List, X, Send, Upload } from "lucide-react";
import type { Task } from "@/types/tasks";
import { ImportTasksButton } from "./ImportTasksButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
}

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const DEFAULT_DURATION = 1500; // 25 minutes in seconds

export const TaskInput = ({ onTaskAdd }: TaskInputProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [isBulkAdd, setIsBulkAdd] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    if (isBulkAdd) {
      const tasks = newTaskName.split('\n').filter(task => task.trim());
      tasks.forEach(taskLine => {
        if (taskLine.trim()) {
          const [taskName, durationStr] = taskLine.split(',').map(s => s.trim());
          const task: Task = {
            id: generateId(),
            name: taskName,
            completed: false,
            duration: durationStr 
              ? Math.min(Math.max(parseInt(durationStr), 1), 60) * 60 
              : DEFAULT_DURATION,
            createdAt: new Date().toISOString(),
          };
          onTaskAdd(task);
        }
      });
    } else {
      const task: Task = {
        id: generateId(),
        name: newTaskName.trim(),
        completed: false,
        duration: DEFAULT_DURATION,
        createdAt: new Date().toISOString(),
      };
      onTaskAdd(task);
    }
    setNewTaskName("");
  };

  const handleTasksImport = (importedTasks: Omit<Task, 'id' | 'createdAt'>[]) => {
    importedTasks.forEach(taskData => {
      const task: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      onTaskAdd(task);
    });
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
            />
          ) : (
            <Input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add a new task..."
              className="pr-8 bg-card/50 border-primary/10 focus:border-primary/20 shadow-sm h-12"
            />
          )}
          {newTaskName && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <ImportTasksButton onTasksImport={handleTasksImport} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="border-primary/20 hover:bg-primary/5">
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
            disabled={!newTaskName.trim()}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
