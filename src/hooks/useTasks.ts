
import { useTaskContext } from '@/contexts/tasks/TaskContext';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { Task } from '@/types/tasks';
import { toast } from 'sonner';

/**
 * Unified tasks hook that combines functionality from multiple task hooks
 */
export function useTasks() {
  const taskContext = useTaskContext();
  const taskEvents = useTaskEvents();

  const createHabitTask = (
    habitId: string,
    templateId: string,
    name: string,
    duration: number = 1500,
    date: string = new Date().toISOString().split('T')[0],
    options: any = {}
  ) => {
    console.log(`Creating task for habit ${habitId}`);
    
    const taskId = `habit-${habitId}-${date}`;
    
    const newTask: Task = {
      id: taskId,
      name,
      description: `Task for habit on ${date}`,
      type: 'habit',
      completed: false,
      duration: duration || 1800, // Default 30 minutes
      createdAt: new Date().toISOString(),
      relationships: {
        habitId,
        templateId,
        date,
        metricType: options.metricType
      }
    };
    
    // Create the task
    taskEvents.createTask(newTask);
    
    // Optionally show a toast
    if (!options?.suppressToast) {
      toast.success(`Created task for habit: ${name}`);
    }
    
    return taskId;
  };

  return {
    getTask: (taskId: string): Task | null => {
      if (!taskId) return null;
      const foundTask = taskContext.items.find((task) => task.id === taskId);
      return foundTask || null;
    },
    updateTask: taskEvents.updateTask,
    addTask: taskContext.addTask,
    deleteTask: taskEvents.deleteTask,
    completeTask: taskEvents.completeTask,
    dismissTask: taskEvents.dismissTask,
    selectTask: taskEvents.selectTask,
    createHabitTask,
    tasks: taskContext.items,
    completedTasks: taskContext.completed,
  };
}
