
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
        items: action.payload.items || [],
        completed: action.payload.completed || [],
        isLoaded: true
      };
      
    case 'ADD_TASK':
      // Don't add if task already exists - safe check for undefined items
      if (state.items && state.items.some(task => task.id === action.payload.id)) {
        return state;
      }
      
      return {
        ...state,
        items: [action.payload, ...(state.items || [])]
      };
      
    case 'UPDATE_TASK': {
      const { taskId, updates } = action.payload;
      
      // Check if updating an active task - safe check for undefined items
      if (state.items && state.items.some(task => task.id === taskId)) {
        // Only move to completed if explicitly set to completed status
        if (updates.status === 'completed' || updates.completed === true) {
          const taskToComplete = state.items.find(task => task.id === taskId);
          if (!taskToComplete) return state;
          
          const completedTask = { 
            ...taskToComplete, 
            ...updates, 
            completed: true,
            completedAt: updates.completedAt || new Date().toISOString(),
            status: 'completed' as const // Use const assertion to ensure correct type
          };
          
          return {
            ...state,
            items: state.items.filter(task => task.id !== taskId),
            completed: [completedTask, ...(state.completed || [])],
            selected: state.selected === taskId ? null : state.selected
          };
        }
        
        // For all other status updates, keep tasks in the active list
        return {
          ...state,
          items: state.items.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      
      // Check if updating a completed task - safe check for undefined completed
      if (state.completed && state.completed.some(task => task.id === taskId)) {
        // If status is changed from completed to something else, move back to active
        if (updates.status && updates.status !== 'completed') {
          const taskToReactivate = state.completed.find(task => task.id === taskId);
          if (!taskToReactivate) return state;
          
          const reactivatedTask = { 
            ...taskToReactivate, 
            ...updates, 
            completed: false,
            completedAt: null,
            status: updates.status
          };
          
          return {
            ...state,
            items: [reactivatedTask, ...(state.items || [])],
            completed: state.completed.filter(task => task.id !== taskId)
          };
        }
        
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
        items: state.items ? state.items.filter(task => task.id !== taskId) : [],
        completed: state.completed ? state.completed.filter(task => task.id !== taskId) : [],
        selected: state.selected === taskId ? null : state.selected
      };
    }
      
    case 'COMPLETE_TASK': {
      const { taskId, metrics } = action.payload;
      
      // Safe check for undefined items
      const taskToComplete = state.items && state.items.length > 0 
        ? state.items.find(task => task.id === taskId) 
        : undefined;
      
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
        items: state.items ? state.items.filter(task => task.id !== taskId) : [],
        completed: [completedTask, ...(state.completed || [])],
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

