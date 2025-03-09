
import { Task } from '@/types/tasks';

export interface TaskContextState {
  items: Task[];
  completed: Task[];
  selected: string | null;
  isLoaded: boolean;
}
