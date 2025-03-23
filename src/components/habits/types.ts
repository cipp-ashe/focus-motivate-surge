
// If this file doesn't exist, we need to create it with proper type definitions for HabitTemplate
import { DayOfWeek } from './types';

export type HabitTemplate = {
  id: string;
  name: string;
  description: string;
  category?: string;
  defaultHabits: Array<{
    name: string;
    description?: string;
    type?: string;
  }>;
};

export type NewTemplate = {
  name: string;
  description: string;
  defaultHabits: Array<{
    name: string;
    description?: string;
    type?: string;
  }>;
};

export interface TabSectionProps {
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
}

export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  type?: string;
  category?: string;
  insights: Array<{
    type: string;
    description: string;
  }>;
  tips: string[];
}

export interface HabitProgress {
  date: string;
  value: boolean | number;
}

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
