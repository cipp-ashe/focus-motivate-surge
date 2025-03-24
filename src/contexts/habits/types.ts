
/**
 * Habit Context Types
 * 
 * This module defines the types for the habit context state and actions.
 */

import { ActiveTemplate, DayOfWeek, HabitTemplate, HabitDetail } from '@/types/habits/types';

/**
 * State interface for HabitContext
 */
export interface HabitState {
  templates: ActiveTemplate[];
  todaysHabits: HabitDetail[];
  progress: Record<string, Record<string, boolean | number>>;
  customTemplates: HabitTemplate[];
  isLoaded: boolean;
}

/**
 * Actions interface for habit operations
 */
export interface HabitContextActions {
  addTemplate: (template: Partial<ActiveTemplate> & { habits: HabitDetail[] }) => void;
  updateTemplate: (templateId: string, updates: Partial<ActiveTemplate>) => void;
  removeTemplate: (templateId: string) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (templateId: string, days: DayOfWeek[]) => void;
  addCustomTemplate: (template: Omit<HabitTemplate, 'id'>) => void;
  removeCustomTemplate: (templateId: string) => void;
  reorderTemplates: (templates: ActiveTemplate[]) => void;
  findTemplateById: (templateId: string) => ActiveTemplate | undefined;
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
