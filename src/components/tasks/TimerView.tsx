import React, { useState, useEffect, useCallback } from 'react';
import { Task } from '@/types/tasks';
import { eventManager } from '@/lib/events/EventManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, CheckCheck, Clock, CalendarClock, PlusCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface TimerViewProps {
  onTaskSelect?: (taskId: string) => void;
}

const TimerView: React.FC<TimerViewProps> = ({ onTaskSelect }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [currentNotes, setCurrentNotes] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Load all tasks marked for timer or focus
  useEffect(() => {
    // Listen for task:timer events
    const unsubscribe = eventManager.on('task:timer', (data: Task) => {
      console.log('TimerView received task:timer event', data);
      // Update tasks list with the new task
      setTasks(prev => {
        // If task already exists, replace it
        const exists = prev.some(t => t.id === data.id);
        if (exists) {
          return prev.map(t => t.id === data.id ? data : t);
        }
        // Otherwise add it to the list
        return [...prev, data];
      });
    });

    // Initial load of timer tasks from localStorage
    const loadTasks = () => {
      try {
        const storedTasks = localStorage.getItem('timer-tasks');
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Error loading timer tasks:', error);
      }
    };

    loadTasks();
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('timer-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving timer tasks:', error);
    }
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      toast.error("Task name cannot be empty");
      return;
    }

    const newTask: Task = {
      id: `timer-${Date.now()}`,
      name: newTaskName.trim(),
      description: newTaskDescription.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      taskType: 'timer',
      timerMinutes: 25,
      timerSeconds: 0,
      timerNotes: ""
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskName("");
    setNewTaskDescription("");
    setIsAddingTask(false);
    toast.success("Task added successfully");

    // Emit task:add event
    eventManager.emit('task:add', newTask);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    if (onTaskSelect) {
      onTaskSelect(task.id);
    }

    // Emit task:select event
    eventManager.emit('task:select', { taskId: task.id });
  };

  const handleEditNotes = (task: Task) => {
    setCurrentNotes(task.timerNotes || "");
    setEditingTaskId(task.id);
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (!editingTaskId) return;

    setTasks(prev => prev.map(task => {
      if (task.id === editingTaskId) {
        return { ...task, timerNotes: currentNotes };
      }
      return task;
    }));

    // Update task notes
    eventManager.emit('task:update', { 
      taskId: editingTaskId, 
      updates: { timerNotes: currentNotes }
    });

    setNotesDialogOpen(false);
    setCurrentNotes("");
    setEditingTaskId(null);
    toast.success("Notes saved successfully");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    
    // If the deleted task was selected, deselect it
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    // Emit task:delete event
    eventManager.emit('task:delete', { taskId });
    toast.success("Task removed from timer list");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Timer Tasks</h2>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsAddingTask(true)}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </div>

      {isAddingTask ? (
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">New Timer Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="What do you want to work on?"
                  className="w-full"
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="task-description">Description (Optional)</Label>
                <Textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Add some details..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingTask(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddTask}
            >
              Save Task
            </Button>
          </CardFooter>
        </Card>
      ) : tasks.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
          <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Timer Tasks</h3>
          <p className="text-muted-foreground mb-4">
            Add tasks that you want to track time for
          </p>
          <Button 
            onClick={() => setIsAddingTask(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Timer Task</span>
          </Button>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-2 pb-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "flex items-start p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedTask?.id === task.id 
                    ? "bg-primary/10 border-primary/30" 
                    : "hover:bg-accent/50 border-border/50"
                )}
                onClick={() => handleSelectTask(task)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-base">{task.name}</h3>
                    {task.timerNotes && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 ml-1 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNotes(task);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {task.description}
                    </p>
                  )}
                  <div className="flex mt-2 gap-2">
                    <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-800 dark:text-purple-300">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.timerMinutes || 25} min
                    </span>
                    {!task.timerNotes && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="h-5 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNotes(task);
                        }}
                      >
                        Add notes
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes for this timer session</Label>
              <Textarea
                id="notes"
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="What do you want to accomplish during this session?"
                className="min-h-[150px]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setNotesDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveNotes}
            >
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TimerView;
