
import { Task } from '@/types/tasks';

export interface TaskEventHandlerProps {
  items: Task[];
  completed: Task[];
  dispatch: React.Dispatch<any>;
}

export interface EventDebounceState {
  lastEventTime: Record<string, number>;
  lastForceUpdateTime: number;
  preventReentrantUpdate: boolean;
}

export interface TaskEventState {
  pendingTaskUpdates: Task[];
  isInitializing: boolean;
}
