
import React, { useEffect } from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { ListTodo, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface TaskListProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksUpdate: (taskId: string, updates: any) => void;
  onTasksClear: () => void;
  onCompletedTasksClear: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksUpdate,
  onTasksClear,
  onCompletedTasksClear,
}) => {
  const navigate = useNavigate();

  // Debug: Log tasks whenever the component renders
  useEffect(() => {
    console.log("TaskList rendering with tasks:", tasks);
  }, [tasks]);

  const handleTaskAdd = (task: Task) => {
    // Log task creation attempt
    console.log("Attempting to add task:", task);
    
    // Check if it would be a duplicate
    if (tasks.some(t => t.name === task.name && !t.completed)) {
      console.log("Skipping duplicate task:", task.name);
      return;
    }
    
    // Emit the event to create the task
    eventBus.emit('task:create', task);
  };

  const handleConfigureHabits = () => {
    console.log('Navigating to habits page');
    navigate('/habits');
  };

  return (
    <Card className="w-full shadow-lg border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-card/80 border-b border-primary/5 py-4">
        <div className="w-full">
          <TaskInput onTaskAdd={handleTaskAdd} />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="px-6 py-4 border-b border-primary/5 bg-gradient-to-r from-card/80 to-card/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <ListTodo className="h-4 w-4 text-primary" />
              <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Active Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleConfigureHabits}
                className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-200"
              >
                <Settings2 className="h-3.5 w-3.5" />
                Configure Habits
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-card/20 backdrop-blur-sm w-full">
          {tasks.length > 0 ? (
            <TaskTable
              tasks={tasks}
              selectedTasks={selectedTasks}
              onTaskClick={onTaskClick}
              onTaskDelete={onTaskDelete}
              onTasksUpdate={onTasksUpdate}
              onTasksClear={onTasksClear}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6 text-muted-foreground">
              <ListTodo className="h-8 w-8 text-muted-foreground/30 mb-4" />
              <p className="font-medium text-lg">No active tasks</p>
              <p className="text-sm mt-2 max-w-md">Add a new task above to get started with your productivity journey</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
