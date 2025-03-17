
import { Task } from '@/types/tasks';
import { TaskAction } from './types';

export interface TaskState {
  items: Task[];
  completed: Task[];
  selected: string | null;
  isLoaded: boolean;
}

export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return {
        ...state,
        items: action.payload.items,
        completed: action.payload.completed,
        isLoaded: true
      };
      
    case 'ADD_TASK':
      // Don't add if task already exists
      if (state.items.some(task => task.id === action.payload.id)) {
        return state;
      }
      
      return {
        ...state,
        items: [action.payload, ...state.items]
      };
      
    case 'UPDATE_TASK': {
      const { taskId, updates } = action.payload;
      
      // Check if updating an active task
      if (state.items.some(task => task.id === taskId)) {
        return {
          ...state,
          items: state.items.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      
      // Check if updating a completed task
      if (state.completed.some(task => task.id === taskId)) {
        return {
          ...state,
          completed: state.completed.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      
      return state;
    }
      
    case 'DELETE_TASK': {
      const { taskId } = action.payload;
      
      return {
        ...state,
        items: state.items.filter(task => task.id !== taskId),
        completed: state.completed.filter(task => task.id !== taskId),
        selected: state.selected === taskId ? null : state.selected
      };
    }
      
    case 'COMPLETE_TASK': {
      const { taskId, metrics } = action.payload;
      const taskToComplete = state.items.find(task => task.id === taskId);
      
      if (!taskToComplete) {
        return state;
      }
      
      const completedTask: Task = {
        ...taskToComplete,
        completed: true,
        completedAt: new Date().toISOString(),
        status: 'completed',
        metrics: metrics ? { ...(taskToComplete.metrics || {}), ...metrics } : taskToComplete.metrics
      };
      
      return {
        ...state,
        items: state.items.filter(task => task.id !== taskId),
        completed: [completedTask, ...state.completed],
        selected: state.selected === taskId ? null : state.selected
      };
    }
      
    case 'SELECT_TASK':
      return {
        ...state,
        selected: action.payload
      };
      
    default:
      return state;
  }
};
