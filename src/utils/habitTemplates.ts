/**
 * Habit Template Utilities
 * 
 * Utility functions for working with habit templates
 */

import { HabitTemplate, ActiveTemplate, HabitDetail, DayOfWeek, DEFAULT_ACTIVE_DAYS } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converts a template to an active template
 * @param template The template to convert
 * @returns An active template
 */
export const convertToActiveTemplate = (template: HabitTemplate): ActiveTemplate => {
  return {
    templateId: template.id,
    name: template.name,
    description: template.description,
    habits: template.defaultHabits,
    activeDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
    customized: false
  };
};

/**
 * Creates a new active template based on a template
 * @param template The template to base the active template on
 * @param activeDays The days the template should be active
 * @returns A new active template
 */
export const createActiveTemplate = (
  template: HabitTemplate, 
  activeDays?: DayOfWeek[]
): ActiveTemplate => {
  return {
    templateId: template.id,
    name: template.name,
    description: template.description,
    habits: [...template.defaultHabits],
    activeDays: activeDays || template.defaultDays || DEFAULT_ACTIVE_DAYS,
    customized: false
  };
};

/**
 * Creates a new habit template
 * @param name The name of the template
 * @param description The description of the template
 * @param category The category of the template
 * @param defaultHabits The default habits in the template
 * @param defaultDays The default days the template should be active
 * @returns A new habit template
 */
export const createHabitTemplate = (
  name: string,
  description: string,
  category: string,
  defaultHabits: HabitDetail[],
  defaultDays?: DayOfWeek[]
): HabitTemplate => {
  return {
    id: uuidv4(),
    name,
    description,
    category,
    defaultHabits,
    defaultDays: defaultDays || DEFAULT_ACTIVE_DAYS
  };
};

/**
 * Creates a default habit template with no habits
 * @param name The name of the template
 * @param category The category of the template
 * @returns A new habit template
 */
export const createEmptyTemplate = (
  name: string = 'Custom Template',
  category: string = 'Personal'
): HabitTemplate => {
  return createHabitTemplate(
    name,
    'A custom habit template',
    category,
    [],
    DEFAULT_ACTIVE_DAYS
  );
};

// Export habitTemplates so it can be imported
export const habitTemplates = {
  // Default templates would go here
  getDefaultTemplates: () => []
};
