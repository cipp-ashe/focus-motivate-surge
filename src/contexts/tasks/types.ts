
import { Task, TaskMetrics } from '@/types/tasks';

/**
 * State interface for TaskContext
 */
export interface TaskContextState {
  items: Task[];
  completed: Task[];
  selected: string | null;
  isLoaded: boolean;
}

/**
 * Action interface for task operations
 */
export interface TaskContextActions {
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string, reason?: string) => void;
  completeTask: (taskId: string, metrics?: TaskMetrics) => void;
  selectTask: (taskId: string | null) => void;
  forceTasksReload: () => void;
}

/**
 * Combined type for full task context
 */
export type TaskContext = TaskContextState & TaskContextActions;
