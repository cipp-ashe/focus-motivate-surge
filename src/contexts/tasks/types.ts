
import { Task } from '@/types/tasks';

/**
 * TaskContextState interface for the task context
 */
export interface TaskContextState {
  /** Array of active tasks */
  items: Task[];
  /** Array of completed tasks */
  completed: Task[];
  /** ID of the currently selected task, if any */
  selected: string | null;
  /** Whether the tasks have been loaded */
  isLoaded: boolean;
  
  // Task operations
  /** Add a new task */
  addTask: (task: Task) => void;
  /** Update an existing task */
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  /** Delete a task */
  deleteTask: (taskId: string, reason?: string) => void;
  /** Complete a task */
  completeTask: (taskId: string, metrics?: any) => void;
  /** Select a task */
  selectTask: (taskId: string | null) => void;
}
