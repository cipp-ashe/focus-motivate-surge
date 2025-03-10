
import type { StateContext, EntityRelationship } from '@/types/state/index';
import type { Task } from '@/types/tasks';
import type { Note } from '@/types/notes';
import type { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import { taskReducer } from './reducers/taskReducer';
import { habitReducer } from './reducers/habitReducer';
import { noteReducer } from './reducers/noteReducer';
import { relationshipReducer } from './reducers/relationshipReducer';

export type StateAction =
  | { type: 'LOAD_INITIAL_STATE'; payload: { tasks: Task[]; completed: Task[]; templates: ActiveTemplate[]; notes: Note[] } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; metrics?: any } }
  | { type: 'SELECT_TASK'; payload: string | null }
  | { type: 'ADD_TEMPLATE'; payload: ActiveTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: { templateId: string; updates: Partial<ActiveTemplate> } }
  | { type: 'REMOVE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_TEMPLATE_ORDER'; payload: ActiveTemplate[] }
  | { type: 'UPDATE_TEMPLATE_DAYS'; payload: { templateId: string; days: DayOfWeek[] } }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { noteId: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'ADD_RELATIONSHIP'; payload: EntityRelationship }
  | { type: 'REMOVE_RELATIONSHIP'; payload: { sourceId: string; targetId: string } };

export const stateReducer = (state: StateContext, action: StateAction): StateContext => {
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

    // Task actions
    case 'ADD_TASK':
    case 'UPDATE_TASK':
    case 'DELETE_TASK':
    case 'COMPLETE_TASK':
    case 'SELECT_TASK':
      return {
        ...state,
        tasks: taskReducer(state.tasks, action),
      };

    // Habit/Template actions
    case 'ADD_TEMPLATE':
    case 'UPDATE_TEMPLATE':
    case 'REMOVE_TEMPLATE':
    case 'UPDATE_TEMPLATE_ORDER':
    case 'UPDATE_TEMPLATE_DAYS':
      return {
        ...state,
        habits: habitReducer(state.habits, action),
      };

    // Note actions
    case 'ADD_NOTE':
    case 'UPDATE_NOTE':
    case 'DELETE_NOTE':
    case 'SELECT_NOTE':
      return {
        ...state,
        notes: noteReducer(state.notes, action),
      };

    // Relationship actions
    case 'ADD_RELATIONSHIP':
    case 'REMOVE_RELATIONSHIP':
      return {
        ...state,
        relationships: relationshipReducer(state.relationships, action),
      };

    default:
      return state;
  }
};
