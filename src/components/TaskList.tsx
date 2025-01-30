import { useState, useEffect } from "react";
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
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Plus, List, CheckCircle2, Sparkles, Trash2, AlertCircle } from "lucide-react";
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
  onTasksClear: () => void;
}

// Load tasks from localStorage
const loadSavedTasks = () => {
  try {
    const savedTasks = localStorage.getItem('taskList');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    return {
      tasks: savedTasks ? JSON.parse(savedTasks) : [],
      completedTasks: savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [],
    };
  } catch (error) {
    console.error('Error loading saved tasks:', error);
    return { tasks: [], completedTasks: [] };
  }
};

export const TaskList = ({ tasks, onTaskAdd, onTaskSelect, completedTasks, onTasksClear }: TaskListProps) => {
  const [newTask, setNewTask] = useState("");
  const [bulkTasks, setBulkTasks] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now().toString(),
        name: newTask.trim(),
        completed: false,
      };
      onTaskAdd(task);
      setNewTask("");
      toast("Task added! Let's make it happen! ✨");
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
    toast(`Added ${taskNames.length} tasks! Time to crush some goals! 🎯`);
  };

  const handleClearTasks = () => {
    setShowClearConfirm(false);
    onTasksClear();
    toast("Tasks cleared! Starting fresh! 🌟");
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary/20 hover:bg-primary/20">
                <List className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-primary/20">
              <DialogHeader>
                <DialogTitle>Bulk Add Tasks</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Enter tasks (one per line)..."
                value={bulkTasks}
                onChange={(e) => setBulkTasks(e.target.value)}
                className="min-h-[200px] bg-background/50 border-primary/20"
              />
              <Button 
                onClick={handleBulkAdd}
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary"
              >
                Add Tasks
              </Button>
            </DialogContent>
          </Dialog>
          <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-destructive/20 hover:bg-destructive/20">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </DialogTrigger>
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
                  onClick={handleClearTasks}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Clear All
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onTaskSelect(task)}
              className="task-list-item p-3 rounded-lg bg-background/50 hover:bg-primary/20 cursor-pointer transition-all duration-300 border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{task.name}</span>
              </div>
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full justify-between hover:bg-primary/20 border border-primary/20"
            >
              <span className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
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
                    className="completed-task-enter completed-task-enter-active p-2 text-sm text-muted-foreground line-through bg-background/30 rounded-lg border border-primary/10"
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