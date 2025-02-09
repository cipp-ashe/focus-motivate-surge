
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, DayOfWeek, HabitTemplate, DEFAULT_ACTIVE_DAYS } from '../types';

const STORAGE_KEY = 'habit-templates';

export const useTemplateManagement = () => {
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTemplates));
  }, [activeTemplates]);

  const addTemplate = useCallback((template: HabitTemplate) => {
    setActiveTemplates(prev => {
      const exists = prev.some(t => t.templateId === template.id);
      if (exists) {
        toast.error('Template already exists');
        return prev;
      }
      
      const newTemplate: ActiveTemplate = {
        templateId: template.id,
        habits: template.defaultHabits,
        activeDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
        customized: false,
      };
      
      toast.success('Template added successfully');
      return [...prev, newTemplate];
    });
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    setActiveTemplates(prev => {
      const updated = prev.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      );
      return updated;
    });
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setActiveTemplates(prev => 
      prev.filter(template => template.templateId !== templateId)
    );
    toast.success('Template removed');
  }, []);

  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    setActiveTemplates(templates);
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    setActiveTemplates(prev => {
      const updated = prev.map(template =>
        template.templateId === templateId
          ? { ...template, activeDays: days, customized: true }
          : template
      );
      return updated;
    });
  }, []);

  return {
    activeTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  };
};
