
import type { StateContext } from '@/types/state';
import type { Task } from '@/types/tasks';

type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; metrics?: any } }
  | { type: 'SELECT_TASK'; payload: string | null };

export const taskReducer = (state: StateContext['tasks'], action: TaskAction): StateContext['tasks'] => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        items: state.items.map(task =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        items: state.items.filter(task => task.id !== action.payload),
        selected: state.selected === action.payload ? null : state.selected,
      };

    case 'COMPLETE_TASK': {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (!task) return state;

      const completedTask = {
        ...task,
        completed: true,
        metrics: action.payload.metrics,
      };

      return {
        ...state,
        items: state.items.filter(t => t.id !== action.payload.taskId),
        completed: [...state.completed, completedTask],
        selected: state.selected === action.payload.taskId ? null : state.selected,
      };
    }

    case 'SELECT_TASK':
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
};
