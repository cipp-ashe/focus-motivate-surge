
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';
import { Task } from '@/types/tasks';

export function useTasks() {
  const taskContext = useTaskContext();
  const taskManager = useUnifiedTaskManager();
  
  return {
    getTask: (taskId: string): Task | null => {
      if (!taskId) return null;
      const foundTask = taskContext.items.find(task => task.id === taskId);
      return foundTask || null;
    },
    updateTask: taskManager.updateTask,
    addTask: taskContext.addTask,
    deleteTask: taskManager.deleteTask,
    completeTask: taskManager.completeTask,
    selectTask: taskManager.selectTask,
    tasks: taskContext.items,
    completedTasks: taskContext.completed
  };
}
