
import { ActiveTemplate, DayOfWeek, HabitTemplate } from '@/components/habits/types';

export interface HabitState {
  templates: ActiveTemplate[];
  todaysHabits: any[];
  progress: Record<string, Record<string, boolean | number>>;
  customTemplates: HabitTemplate[];
}

export interface HabitContextActions {
  addTemplate: (template: Omit<ActiveTemplate, 'templateId'>) => void;
  updateTemplate: (templateId: string, updates: Partial<ActiveTemplate>) => void;
  removeTemplate: (templateId: string) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (templateId: string, days: DayOfWeek[]) => void;
  addCustomTemplate: (template: Omit<HabitTemplate, 'id'>) => void;
  removeCustomTemplate: (templateId: string) => void;
}

export const initialState: HabitState = {
  templates: [],
  todaysHabits: [],
  progress: {},
  customTemplates: [],
};
