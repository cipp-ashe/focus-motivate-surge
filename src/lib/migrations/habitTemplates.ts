
import { ActiveTemplate, HabitDetail } from '@/components/habits/types';

/**
 * Ensures habit template structure is consistent
 */
export const migrateHabitTemplate = (template: any): ActiveTemplate => {
  // Ensure template has the basic required structure
  const migratedTemplate: ActiveTemplate = {
    templateId: template.templateId || template.id || `template-${Date.now()}`,
    name: template.name || 'Unnamed Template',
    description: template.description || '',
    customized: template.customized || false,
    activeDays: template.activeDays || template.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    habits: []
  };

  // Ensure each habit has the required structure
  if (Array.isArray(template.habits)) {
    migratedTemplate.habits = template.habits.map((habit: any): HabitDetail => ({
      id: habit.id || `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: habit.name || 'Unnamed Habit',
      description: habit.description || '',
      metrics: habit.metrics || { type: 'boolean', target: 1 },
      category: habit.category || 'General',
      timePreference: habit.timePreference || 'Anytime',
      insights: habit.insights || [],
      tips: habit.tips || [],
      order: habit.order || 0,
      relationships: {
        templateId: migratedTemplate.templateId,
        habitId: habit.id,
        ...(habit.relationships || {})
      }
    }));
  }

  return migratedTemplate;
};

/**
 * Migrates all templates in localStorage to ensure consistency
 */
export const migrateHabitTemplates = (): void => {
  try {
    const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
    
    if (templates.length === 0) return;
    
    const migratedTemplates = templates.map(migrateHabitTemplate);
    
    localStorage.setItem('habit-templates', JSON.stringify(migratedTemplates));
    console.log('Habit templates migrated successfully');
  } catch (error) {
    console.error('Error migrating habit templates:', error);
  }
};

// Run migration on import
migrateHabitTemplates();
