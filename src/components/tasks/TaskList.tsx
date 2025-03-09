
import React from 'react';
import { Task } from '@/types/tasks';
import { eventBus } from '@/lib/eventBus';
import { TaskInput } from './TaskInput';
import { TaskTable } from './TaskTable';
import { ListTodo, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';

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
  const { open: openHabits } = useHabitsPanel();

  const handleTaskAdd = (task: Task) => {
    // Prevent duplicate task creation
    if (tasks.some(t => t.name === task.name && !t.completed)) {
      return;
    }
    eventBus.emit('task:create', task);
  };

  const handleConfigureHabits = () => {
    console.log('Opening habits panel');
    openHabits();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <TaskInput onTaskAdd={handleTaskAdd} />
      </div>

      <div className="flex-none px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <ListTodo className="h-4 w-4 text-primary" />
            <span className="font-medium">Active Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleConfigureHabits}
              className="flex items-center gap-2"
            >
              <Settings2 className="h-4 w-4" />
              Configure Habits
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground space-y-4">
            <ListTodo className="h-8 w-8 text-muted-foreground/50" />
            <div className="space-y-2">
              <p>No active tasks</p>
              <p className="text-sm">Add a new task above to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
