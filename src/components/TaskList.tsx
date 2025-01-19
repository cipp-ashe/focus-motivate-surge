import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus, List, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskSelect: (task: Task) => void;
  completedTasks: Task[];
}

export const TaskList = ({ tasks, onTaskAdd, onTaskSelect, completedTasks }: TaskListProps) => {
  const [newTask, setNewTask] = useState("");
  const [bulkTasks, setBulkTasks] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now().toString(),
        name: newTask.trim(),
        completed: false,
      };
      onTaskAdd(task);
      setNewTask("");
      toast("Task added successfully!");
    }
  };

  const handleBulkAdd = () => {
    const taskNames = bulkTasks
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t);

    taskNames.forEach((name) => {
      onTaskAdd({
        id: Date.now().toString(),
        name,
        completed: false,
      });
    });

    setBulkTasks("");
    toast(`Added ${taskNames.length} tasks!`);
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <List className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Add Tasks</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Enter tasks (one per line)..."
                value={bulkTasks}
                onChange={(e) => setBulkTasks(e.target.value)}
                className="min-h-[200px]"
              />
              <Button onClick={handleBulkAdd}>Add Tasks</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskSelect(task)}
              className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 cursor-pointer transition-colors"
            >
              {task.name}
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full justify-between"
            >
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed Tasks
              </span>
              <span className="text-sm text-muted-foreground">
                {completedTasks.length}
              </span>
            </Button>
            
            {showCompleted && (
              <div className="space-y-2 pl-4">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 text-sm text-muted-foreground line-through"
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};