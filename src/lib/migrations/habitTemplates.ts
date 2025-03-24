
/**
 * Habit Template Migration
 * 
 * Utilities for migrating habit templates between versions
 */

import { ActiveTemplate, HabitDetail, DayOfWeek } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Migrates an old template format to the new format
 * @param oldTemplate The template in the old format
 * @returns A template in the new format
 */
export const migrateTemplateFormat = (oldTemplate: any): ActiveTemplate => {
  // Ensure habits have the correct format
  const migratedHabits = (oldTemplate.habits || []).map((habit: any): HabitDetail => {
    // Ensure metrics have the correct format
    const metrics = {
      type: habit.metrics?.type || 'boolean',
      goal: habit.metrics?.goal,
      target: habit.metrics?.target,
      unit: habit.metrics?.unit,
      min: habit.metrics?.min,
      max: habit.metrics?.max
    };
    
    return {
      id: habit.id || uuidv4(),
      name: habit.name || 'Unnamed Habit',
      description: habit.description || '',
      category: habit.category || 'Personal',
      timePreference: habit.timePreference || 'Anytime',
      metrics,
      order: habit.order || 0
    };
  });
  
  // Ensure active days are in the correct format
  const activeDays = (oldTemplate.activeDays || []).filter((day: any) => 
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(day)
  ) as DayOfWeek[];
  
  // If no valid active days, use default weekdays
  if (activeDays.length === 0) {
    activeDays.push('Mon', 'Tue', 'Wed', 'Thu', 'Fri');
  }
  
  return {
    templateId: oldTemplate.templateId || uuidv4(),
    name: oldTemplate.name || 'Unnamed Template',
    description: oldTemplate.description || '',
    habits: migratedHabits,
    activeDays,
    customized: !!oldTemplate.customized
  };
};

/**
 * Migrates all habit templates to the newest format
 * @returns Whether the migration was successful
 */
export const migrateAllTemplates = (): boolean => {
  try {
    // Get templates from storage
    const templatesStr = localStorage.getItem('active-templates');
    if (!templatesStr) return true; // Nothing to migrate
    
    // Parse templates
    const templates = JSON.parse(templatesStr);
    if (!Array.isArray(templates)) return false;
    
    // Migrate each template
    const migratedTemplates = templates.map(migrateTemplateFormat);
    
    // Save migrated templates
    localStorage.setItem('active-templates', JSON.stringify(migratedTemplates));
    
    console.log(`Migrated ${migratedTemplates.length} templates to the latest format`);
    return true;
  } catch (error) {
    console.error('Error migrating habit templates:', error);
    return false;
  }
};
