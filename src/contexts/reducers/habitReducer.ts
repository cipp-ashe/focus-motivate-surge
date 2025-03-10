
import type { StateContext } from '@/types/state/index';
import type { ActiveTemplate, DayOfWeek } from '@/components/habits/types';

type HabitAction = 
  | { type: 'ADD_TEMPLATE'; payload: ActiveTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: { templateId: string; updates: Partial<ActiveTemplate> } }
  | { type: 'REMOVE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_TEMPLATE_ORDER'; payload: ActiveTemplate[] }
  | { type: 'UPDATE_TEMPLATE_DAYS'; payload: { templateId: string; days: DayOfWeek[] } };

export const habitReducer = (state: StateContext['habits'], action: HabitAction): StateContext['habits'] => {
  switch (action.type) {
    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, action.payload],
      };

    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.templateId === action.payload.templateId
            ? { ...template, ...action.payload.updates }
            : template
        ),
      };

    case 'REMOVE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(
          template => template.templateId !== action.payload
        ),
      };

    case 'UPDATE_TEMPLATE_ORDER':
      return {
        ...state,
        templates: action.payload,
      };

    case 'UPDATE_TEMPLATE_DAYS':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.templateId === action.payload.templateId
            ? { ...template, activeDays: action.payload.days }
            : template
        ),
      };

    default:
      return state;
  }
};
