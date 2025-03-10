
import React from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { ListTodo, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

  const handleTaskAdd = (task: Task) => {
    // Prevent duplicate task creation
    if (tasks.some(t => t.name === task.name && !t.completed)) {
      return;
    }
    eventBus.emit('task:create', task);
  };

  const handleConfigureHabits = () => {
    console.log('Navigating to habits page');
    navigate('/habits');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 pt-4">
        <div className="flex-none">
          <TaskInput onTaskAdd={handleTaskAdd} />
        </div>
      </CardHeader>

      <div className="px-4 py-3 border-t border-b border-border/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <ListTodo className="h-4 w-4 text-purple-400" />
            <span className="font-medium text-purple-400">Active Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleConfigureHabits}
              className="flex items-center gap-2 border-purple-400/30 text-purple-400 hover:bg-purple-400/10"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Configure Habits
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 overflow-y-auto p-0">
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
          <div className="flex flex-col items-center justify-center h-32 text-center p-4 text-muted-foreground">
            <ListTodo className="h-6 w-6 text-muted-foreground/50 mb-2" />
            <p>No active tasks</p>
            <p className="text-sm mt-1">Add a new task above to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
