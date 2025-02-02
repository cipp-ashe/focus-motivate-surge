import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, List, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { TaskItem } from "./TaskItem";
import { CompletedTasks } from "./CompletedTasks";
import { BulkTaskDialog } from "./BulkTaskDialog";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  duration?: number;
}

interface TaskListProps {
  tasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskSelect: (task: Task) => void;
  completedTasks: Task[];
  onTasksClear: () => void;
}

export const TaskList = ({ 
  tasks, 
  onTaskAdd, 
  onTaskSelect, 
  completedTasks, 
  onTasksClear 
}: TaskListProps) => {
  const [newTask, setNewTask] = useState("");
  const [bulkTasks, setBulkTasks] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      onTaskAdd({
        id: Date.now().toString(),
        name: newTask.trim(),
        completed: false,
        duration: 25,
      });
      setNewTask("");
      toast("Task added! Let's make it happen! ✨");
    }
  };

  const handleBulkAdd = () => {
    const taskLines = bulkTasks
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t);

    taskLines.forEach((line) => {
      const [name, durationStr] = line.split(',').map(s => s.trim());
      const duration = durationStr ? Math.min(Math.max(parseInt(durationStr) || 25, 1), 60) : 25;

      onTaskAdd({
        id: Date.now().toString(),
        name,
        completed: false,
        duration,
      });
    });

    setBulkTasks("");
    setShowBulkAdd(false);
    toast(`Added ${taskLines.length} tasks! Time to crush some goals! 🎯`);
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-primary/20">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1 bg-background/50 border-primary/20"
          />
          <Button 
            onClick={handleAddTask}
            className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowBulkAdd(true)}
            className="border-primary/20 hover:bg-primary/20"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowClearConfirm(true)}
            className="border-destructive/20 hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onSelect={onTaskSelect}
            />
          ))}
        </div>

        <CompletedTasks
          tasks={completedTasks}
          showCompleted={showCompleted}
          onToggleShow={() => setShowCompleted(!showCompleted)}
        />

        <BulkTaskDialog
          open={showBulkAdd}
          onOpenChange={setShowBulkAdd}
          bulkTasks={bulkTasks}
          onBulkTasksChange={setBulkTasks}
          onAdd={handleBulkAdd}
        />

        <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle>Clear All Tasks</DialogTitle>
              <DialogDescription>
                Are you sure you want to clear all tasks? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onTasksClear();
                  setShowClearConfirm(false);
                  toast("Tasks cleared! Starting fresh! 🌟");
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};