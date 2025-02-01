import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, ChevronDown } from "lucide-react";
import { Task } from "./TaskList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TaskInputProps {
  onTaskAdd: (task: Task) => void;
}

export const TaskInput = ({ onTaskAdd }: TaskInputProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulkAdd) {
      const tasks = newTaskName.split('\n').filter(task => task.trim());
      tasks.forEach(taskName => {
        if (taskName.trim()) {
          onTaskAdd({
            id: Math.random().toString(),
            name: taskName.trim(),
            completed: false,
          });
        }
      });
    } else {
      if (!newTaskName.trim()) return;
      onTaskAdd({
        id: Math.random().toString(),
        name: newTaskName.trim(),
        completed: false,
      });
    }
    setNewTaskName("");
  };

  return (
    <Card className="p-4 w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            {isBulkAdd ? (
              <Textarea
                ref={textareaRef}
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add multiple tasks (one per line)..."
                className="min-h-[100px] resize-y"
              />
            ) : (
              <Input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add a new task..."
              />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="submit" className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Add {isBulkAdd ? 'Tasks' : 'Task'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsBulkAdd(false)}>
                Single Task Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsBulkAdd(true)}>
                Bulk Add Mode
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </form>
    </Card>
  );
};