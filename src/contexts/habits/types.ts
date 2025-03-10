
import { ActiveTemplate, DayOfWeek, HabitTemplate } from '@/components/habits/types';

/**
 * State interface for HabitContext
 */
export interface HabitState {
  templates: ActiveTemplate[];
  todaysHabits: any[]; // Keep this as 'any' for backward compatibility
  progress: Record<string, Record<string, boolean | number>>;
  customTemplates: HabitTemplate[];
  isLoaded: boolean;
}

/**
 * Actions interface for habit operations
 */
export interface HabitContextActions {
  addTemplate: (template: Omit<ActiveTemplate, 'templateId'>) => void;
  updateTemplate: (templateId: string, updates: Partial<ActiveTemplate>) => void;
  removeTemplate: (templateId: string) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (templateId: string, days: DayOfWeek[]) => void;
  addCustomTemplate: (template: Omit<HabitTemplate, 'id'>) => void;
  removeCustomTemplate: (templateId: string) => void;
  reorderTemplates: (templates: ActiveTemplate[]) => void; // Added this line to match the implementation
  findTemplateById: (templateId: string) => ActiveTemplate | undefined; // Added this missing function
  reloadTemplates: () => void;
}

/**
 * Initial state for habit context
 */
export const initialState: HabitState = {
  templates: [],
  todaysHabits: [],
  progress: {},
  customTemplates: [],
  isLoaded: false,
};

/**
 * Combined type for full habit context
 */
export type HabitContext = HabitState & HabitContextActions;
