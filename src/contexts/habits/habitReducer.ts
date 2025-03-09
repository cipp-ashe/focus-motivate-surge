
import { HabitState } from './types';
import { ActiveTemplate, DayOfWeek } from '@/components/habits/types';

type HabitAction =
  | { type: 'LOAD_TEMPLATES'; payload: ActiveTemplate[] }
  | { type: 'LOAD_CUSTOM_TEMPLATES'; payload: any[] }
  | { type: 'ADD_TEMPLATE'; payload: ActiveTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: { templateId: string; updates: Partial<ActiveTemplate> } }
  | { type: 'REMOVE_TEMPLATE'; payload: string }
  | { type: 'UPDATE_TEMPLATE_ORDER'; payload: ActiveTemplate[] }
  | { type: 'UPDATE_TEMPLATE_DAYS'; payload: { templateId: string; days: DayOfWeek[] } }
  | { type: 'ADD_CUSTOM_TEMPLATE'; payload: any }
  | { type: 'REMOVE_CUSTOM_TEMPLATE'; payload: string }
  | { type: 'UPDATE_TEMPLATE_CUSTOMIZATION'; payload: { templateId: string; customized: boolean } };

/**
 * Unified habit reducer that handles all template-related state updates
 */
export const habitReducer = (state: HabitState, action: HabitAction): HabitState => {
  switch (action.type) {
    case 'LOAD_TEMPLATES':
      return {
        ...state,
        templates: action.payload,
      };
    case 'LOAD_CUSTOM_TEMPLATES':
      return {
        ...state,
        customTemplates: action.payload,
      };
    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, action.payload],
      };
    case 'UPDATE_TEMPLATE':
      const updatedTemplates = state.templates.map(template =>
        template.templateId === action.payload.templateId
          ? { ...template, ...action.payload.updates, customized: true }
          : template
      );
      return {
        ...state,
        templates: updatedTemplates,
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
            ? { ...template, activeDays: action.payload.days, customized: true }
            : template
        ),
      };
    case 'ADD_CUSTOM_TEMPLATE':
      return {
        ...state,
        customTemplates: [...state.customTemplates, action.payload],
      };
    case 'REMOVE_CUSTOM_TEMPLATE':
      return {
        ...state,
        customTemplates: state.customTemplates.filter(
          template => template.id !== action.payload
        ),
      };
    case 'UPDATE_TEMPLATE_CUSTOMIZATION':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.templateId === action.payload.templateId
            ? { ...template, customized: action.payload.customized }
            : template
        ),
      };
    default:
      return state;
  }
};
