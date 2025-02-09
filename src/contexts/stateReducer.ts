
import type { StateContext } from '@/types/state';
import { taskReducer } from './reducers/taskReducer';
import { habitReducer } from './reducers/habitReducer';
import { noteReducer } from './reducers/noteReducer';
import { relationshipReducer } from './reducers/relationshipReducer';

type Action =
  | { type: 'LOAD_INITIAL_STATE'; payload: { tasks: Task[]; completed: Task[]; templates: ActiveTemplate[]; notes: Note[] } }
  | { type: ReturnType<typeof taskReducer> }
  | { type: ReturnType<typeof habitReducer> }
  | { type: ReturnType<typeof noteReducer> }
  | { type: ReturnType<typeof relationshipReducer> };

export const stateReducer = (state: StateContext, action: Action): StateContext => {
  switch (action.type) {
    case 'LOAD_INITIAL_STATE':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: action.payload.tasks,
          completed: action.payload.completed,
        },
        habits: {
          ...state.habits,
          templates: action.payload.templates,
        },
        notes: {
          ...state.notes,
          items: action.payload.notes,
        },
      };

    // Delegate to domain-specific reducers
    default: {
      const { type } = action;
      
      // Task actions
      if (type.startsWith('ADD_TASK') || type.startsWith('UPDATE_TASK') || 
          type.startsWith('DELETE_TASK') || type.startsWith('COMPLETE_TASK') || 
          type.startsWith('SELECT_TASK')) {
        return {
          ...state,
          tasks: taskReducer(state.tasks, action as any),
        };
      }
      
      // Habit/Template actions
      if (type.startsWith('ADD_TEMPLATE') || type.startsWith('UPDATE_TEMPLATE') || 
          type.startsWith('REMOVE_TEMPLATE') || type.startsWith('UPDATE_TEMPLATE_ORDER') || 
          type.startsWith('UPDATE_TEMPLATE_DAYS')) {
        return {
          ...state,
          habits: habitReducer(state.habits, action as any),
        };
      }
      
      // Note actions
      if (type.startsWith('ADD_NOTE') || type.startsWith('UPDATE_NOTE') || 
          type.startsWith('DELETE_NOTE') || type.startsWith('SELECT_NOTE')) {
        return {
          ...state,
          notes: noteReducer(state.notes, action as any),
        };
      }
      
      // Relationship actions
      if (type.startsWith('ADD_RELATIONSHIP') || type.startsWith('REMOVE_RELATIONSHIP')) {
        return {
          ...state,
          relationships: relationshipReducer(state.relationships, action as any),
        };
      }
      
      return state;
    }
  }
};
