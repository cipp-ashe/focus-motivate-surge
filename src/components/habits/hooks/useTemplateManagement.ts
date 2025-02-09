
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, DayOfWeek, HabitTemplate, NewTemplate, DEFAULT_ACTIVE_DAYS } from '../types';

const STORAGE_KEY = 'habit-templates';

export const useTemplateManagement = () => {
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTemplates));
  }, [activeTemplates]);

  const addTemplate = useCallback((template: ActiveTemplate) => {
    setActiveTemplates(prev => {
      const newTemplates = [...prev, template];
      toast.success('Template added successfully');
      return newTemplates;
    });
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    setActiveTemplates(prev =>
      prev.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      )
    );
    toast.success('Template updated successfully');
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setActiveTemplates(prev => prev.filter(template => template.templateId !== templateId));
    toast.success('Template removed successfully');
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
    toast.success('Custom template saved successfully');
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
    toast.success('Template days updated successfully');
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
