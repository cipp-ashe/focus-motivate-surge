
import React from 'react';
import { TaskList } from './TaskList';
import { TaskInput } from './TaskInput';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';
import { taskStorage } from '@/lib/storage/taskStorage';
import { eventManager } from '@/lib/events/EventManager';

interface TaskManagerContentProps {
  tasks: Task[];
  selectedTaskId: string | null;
  onTaskAdd: (task: Task) => void;
  onTasksAdd: (tasks: Task[]) => void;
}

export const TaskManagerContent: React.FC<TaskManagerContentProps> = ({
  tasks,
  selectedTaskId,
  onTaskAdd,
  onTasksAdd
}) => {
  const handleTaskAdd = (task: Task) => {
    console.log("TaskManagerContent - Adding task:", task);
    
    // Add to storage first
    taskStorage.addTask(task);
    
    // Call the parent handler
    onTaskAdd(task);
    
    // Show toast
    toast.success(`Added task: ${task.name}`);
  };

  const handleTasksAdd = (tasks: Task[]) => {
    console.log(`TaskManagerContent - Adding ${tasks.length} tasks`);
    
    // Add all tasks to storage
    tasks.forEach(task => taskStorage.addTask(task));
    
    // Call the parent handler
    onTasksAdd(tasks);
    
    // Show toast
    toast.success(`Added ${tasks.length} tasks`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/10">
        <TaskInput 
          onTaskAdd={handleTaskAdd} 
          onTasksAdd={handleTasksAdd}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <TaskList
          tasks={tasks}
          selectedTasks={selectedTaskId ? [selectedTaskId] : []}
          onTaskClick={(taskId) => eventManager.emit('task:select', taskId)}
        />
      </div>
    </div>
  );
};
