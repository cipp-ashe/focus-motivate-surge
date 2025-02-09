import { useState, useCallback } from 'react';
import { ActiveTemplate, DayOfWeek, HabitTemplate, NewTemplate } from '../types';
import { DEFAULT_ACTIVE_DAYS } from '../types';

export const useTemplateManagement = () => {
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>([]);
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([]);

  const addTemplate = useCallback((template: ActiveTemplate) => {
    setActiveTemplates(prev => [...prev, template]);
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    setActiveTemplates(prev =>
      prev.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      )
    );
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setActiveTemplates(prev =>
      prev.filter(template => template.templateId !== templateId)
    );
  }, []);

  const saveCustomTemplate = useCallback((template: NewTemplate): HabitTemplate => {
    const newTemplate: HabitTemplate = {
      id: `template-${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      defaultHabits: template.defaultHabits || [],
      defaultDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
    };

    setCustomTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    setActiveTemplates(templates);
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    setActiveTemplates(prev =>
      prev.map(template =>
        template.templateId === templateId
          ? { ...template, activeDays: days, customized: true }
          : template
      )
    );
  }, []);

  return {
    activeTemplates,
    customTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    saveCustomTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  };
};
