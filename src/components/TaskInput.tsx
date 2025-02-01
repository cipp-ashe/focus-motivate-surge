import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { List, Plus } from "lucide-react";
import { Task } from "./TaskList";

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
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsBulkAdd(!isBulkAdd)}
            className={isBulkAdd ? "bg-accent" : ""}
          >
            {isBulkAdd ? <List className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
          {isBulkAdd ? (
            <Textarea
              ref={textareaRef}
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add multiple tasks (one per line)..."
              className="flex-1 min-h-[100px] resize-y"
            />
          ) : (
            <Input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
          )}
          <Button type="submit">Add</Button>
        </div>
      </form>
    </Card>
  );
};