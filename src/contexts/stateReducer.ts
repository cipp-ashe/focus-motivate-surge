import type { StateContext } from '@/types/state';
import type { Task } from '@/types/tasks';
import type { Note } from '@/types/notes';
import type { ActiveTemplate, DayOfWeek } from '@/components/habits/types';
import type { EntityType, EntityRelationship, RelationType } from '@/types/state';

type Action =
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

    case 'ADD_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: [...state.tasks.items, action.payload],
        },
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: state.tasks.items.map(task =>
            task.id === action.payload.taskId
              ? { ...task, ...action.payload.updates }
              : task
          ),
        },
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: state.tasks.items.filter(task => task.id !== action.payload),
          selected: state.tasks.selected === action.payload ? null : state.tasks.selected,
        },
      };

    case 'COMPLETE_TASK': {
      const task = state.tasks.items.find(t => t.id === action.payload.taskId);
      if (!task) return state;

      const completedTask = {
        ...task,
        completed: true,
        metrics: action.payload.metrics,
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          items: state.tasks.items.filter(t => t.id !== action.payload.taskId),
          completed: [...state.tasks.completed, completedTask],
          selected: state.tasks.selected === action.payload.taskId ? null : state.tasks.selected,
        },
      };
    }

    case 'SELECT_TASK':
      return {
        ...state,
        tasks: {
          ...state.tasks,
          selected: action.payload,
        },
      };

    case 'ADD_TEMPLATE':
      return {
        ...state,
        habits: {
          ...state.habits,
          templates: [...state.habits.templates, action.payload],
        },
      };

    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        habits: {
          ...state.habits,
          templates: state.habits.templates.map(template =>
            template.templateId === action.payload.templateId
              ? { ...template, ...action.payload.updates }
              : template
          ),
        },
      };

    case 'REMOVE_TEMPLATE':
      return {
        ...state,
        habits: {
          ...state.habits,
          templates: state.habits.templates.filter(
            template => template.templateId !== action.payload
          ),
        },
      };

    case 'UPDATE_TEMPLATE_ORDER':
      return {
        ...state,
        habits: {
          ...state.habits,
          templates: action.payload,
        },
      };

    case 'UPDATE_TEMPLATE_DAYS':
      return {
        ...state,
        habits: {
          ...state.habits,
          templates: state.habits.templates.map(template =>
            template.templateId === action.payload.templateId
              ? { ...template, activeDays: action.payload.days }
              : template
          ),
        },
      };

    case 'ADD_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          items: [...state.notes.items, action.payload],
        },
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          items: state.notes.items.map(note =>
            note.id === action.payload.noteId
              ? { ...note, ...action.payload.updates }
              : note
          ),
        },
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          items: state.notes.items.filter(note => note.id !== action.payload),
          selected: state.notes.selected === action.payload ? null : state.notes.selected,
        },
      };

    case 'SELECT_NOTE':
      return {
        ...state,
        notes: {
          ...state.notes,
          selected: action.payload,
        },
      };

    case 'ADD_RELATIONSHIP':
      return {
        ...state,
        relationships: [...state.relationships, action.payload],
      };

    case 'REMOVE_RELATIONSHIP':
      return {
        ...state,
        relationships: state.relationships.filter(
          rel =>
            !(rel.sourceId === action.payload.sourceId && rel.targetId === action.payload.targetId)
        ),
      };

    default:
      return state;
  }
};
