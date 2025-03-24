
import { useContext } from 'react';
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { Task } from '@/types/tasks';

export function useTasks() {
  const taskContext = useTaskContext();
  
  // Return functions that the TimerView component expects
  return {
    getTask: (taskId: string): Task | null => {
      if (!taskId) return null;
      const foundTask = taskContext.items.find(task => task.id === taskId);
      return foundTask || null;
    },
    updateTask: (taskId: string, updates: Partial<Task>) => {
      return taskContext.updateTask(taskId, updates);
    },
    addTask: taskContext.addTask,
    deleteTask: taskContext.deleteTask,
    completeTask: taskContext.completeTask,
    selectTask: taskContext.selectTask,
    tasks: taskContext.items,
    completedTasks: taskContext.completed
  };
}
