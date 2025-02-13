
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
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
    <Card className="p-4 w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="flex-1 relative">
            {isBulkAdd ? (
              <Textarea
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add multiple tasks (one per line)...&#10;Task name, duration (optional)&#10;Example:&#10;Read book, 30&#10;Write code"
                className="min-h-[100px] resize-y pr-8"
              />
            ) : (
              <Input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add a new task..."
                className="pr-8"
              />
            )}
            {newTaskName && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <ImportTasksButton onTasksImport={handleTasksImport} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="icon">
                  <List className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsBulkAdd(false)}>
                  Single Task Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsBulkAdd(true)}>
                  Bulk Add Mode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit" variant="default" size="icon" disabled={!newTaskName.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
