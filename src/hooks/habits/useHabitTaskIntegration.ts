
import { useCallback } from 'react';
import { eventManager } from '@/lib/events/EventManager';
import { HabitDetail } from '@/types/habit';
import { useUnifiedTaskManager } from '@/hooks/tasks/useUnifiedTaskManager';
import { toast } from 'sonner';

/**
 * Hook to integrate habits with tasks
 * This consolidated hook simplifies the habit-task integration
 */
export const useHabitTaskIntegration = () => {
  const taskManager = useUnifiedTaskManager();

  /**
   * Add a habit to tasks
   */
  const addHabitToTasks = useCallback(
    (habit: HabitDetail) => {
      if (!habit.id) {
        console.error('Cannot add habit to tasks: missing habitId');
        return false;
      }

      const templateId = habit.relationships?.templateId || '';
      const date = new Date().toISOString().split('T')[0];

      // Default duration based on metric type
      let duration = 1500; // 25 minutes by default
      if (habit.metrics?.goal) {
        duration = habit.metrics.goal;
      }

      // Create the habit task
      const taskId = taskManager.createHabitTask(
        habit.id,
        habit.name,
        'habit',
        templateId,
        date,
        {
          duration,
          metricType: habit.metrics.type
        }
      );

      // Force update task list to show the new task
      setTimeout(() => {
        taskManager.forceTaskUpdate();
        eventManager.emit('habits:check-pending', {});
      }, 300);

      toast.success(`Added "${habit.name}" as a task`);
      return true;
    },
    [taskManager]
  );

  /**
   * Complete a habit task
   */
  const completeHabitTask = useCallback((habitId: string, date: string) => {
    // Find and complete any task associated with this habit
    const tasksStr = localStorage.getItem('tasks');
    if (!tasksStr) return false;

    try {
      const tasks = JSON.parse(tasksStr);
      const habitTask = tasks.find(
        (task: any) => task.relationships?.habitId === habitId && task.relationships?.date === date
      );

      if (habitTask && !habitTask.completed) {
        taskManager.completeTask(habitTask.id);
        return true;
      }
    } catch (e) {
      console.error('Error completing habit task:', e);
    }

    return false;
  }, [taskManager]);

  return {
    addHabitToTasks,
    completeHabitTask,
  };
};
