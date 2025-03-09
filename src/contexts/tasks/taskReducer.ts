
import type { TaskContextState } from './types';
import type { Task } from '@/types/tasks';

type TaskAction = 
  | { type: 'LOAD_TASKS'; payload: { tasks: Task[], completed: Task[] } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { taskId: string, reason?: string } }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; metrics?: any } }
  | { type: 'DELETE_TASKS_BY_TEMPLATE'; payload: { templateId: string } }
  | { type: 'SELECT_TASK'; payload: string | null };

export const taskReducer = (state: TaskContextState, action: TaskAction): TaskContextState => {
  switch (action.type) {
    case 'LOAD_TASKS':
      return {
        ...state,
        items: action.payload.tasks,
        completed: action.payload.completed,
        isLoaded: true,
      };
      
    case 'ADD_TASK':
      // Avoid duplicate tasks
      if (state.items.some(task => {
        // Check for duplicate by both ID and relationship to habit
        return task.id === action.payload.id || 
          (task.relationships?.habitId === action.payload.relationships?.habitId && 
           task.relationships?.date === action.payload.relationships?.date);
      })) {
        console.log(`TaskContext: Skipping duplicate task ${action.payload.id} for habit ${action.payload.relationships?.habitId}`);
        return state;
      }
      
      console.log(`TaskContext: Added new task ${action.payload.id}:`, action.payload);
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
      
    case 'DELETE_TASK': {
      const isInItems = state.items.some(task => task.id === action.payload.taskId);
      const isInCompleted = state.completed.some(task => task.id === action.payload.taskId);

      console.log(`TaskContext: Deleting task ${action.payload.taskId}, exists in items: ${isInItems}, exists in completed: ${isInCompleted}`);

      return {
        ...state,
        items: isInItems ? state.items.filter(task => task.id !== action.payload.taskId) : state.items,
        completed: isInCompleted ? state.completed.filter(task => task.id !== action.payload.taskId) : state.completed,
        selected: state.selected === action.payload.taskId ? null : state.selected,
      };
    }
    
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
    
    case 'DELETE_TASKS_BY_TEMPLATE': {
      const templateId = action.payload.templateId;
      console.log(`TaskContext: Deleting all tasks for template ${templateId}`);
      
      // Filter out tasks from this template
      const updatedItems = state.items.filter(task => 
        task.relationships?.templateId !== templateId
      );
      
      const updatedCompleted = state.completed.filter(task => 
        task.relationships?.templateId !== templateId
      );
      
      // Reset selected if it was part of the deleted template
      const selectedTask = state.selected ? 
        state.items.find(t => t.id === state.selected) : 
        null;
        
      const resetSelected = selectedTask?.relationships?.templateId === templateId;
      
      console.log(`TaskContext: Removed ${state.items.length - updatedItems.length} active tasks and ${state.completed.length - updatedCompleted.length} completed tasks`);
      
      return {
        ...state,
        items: updatedItems,
        completed: updatedCompleted,
        selected: resetSelected ? null : state.selected,
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
