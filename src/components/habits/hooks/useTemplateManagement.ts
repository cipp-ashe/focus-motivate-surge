
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { ActiveTemplate, DayOfWeek, HabitTemplate, NewTemplate, DEFAULT_ACTIVE_DAYS } from '../types';

const STORAGE_KEY = 'habit-templates';
const CUSTOM_TEMPLATES_KEY = 'custom-templates';

export const useTemplateManagement = () => {
  const [activeTemplates, setActiveTemplates] = useState<ActiveTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>(() => {
    const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeTemplates));
  }, [activeTemplates]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(customTemplates));
  }, [customTemplates]);

  const createActiveTemplate = useCallback((template: HabitTemplate): ActiveTemplate => ({
    templateId: template.id,
    habits: template.defaultHabits,
    activeDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
    customized: false,
  }), []);

  const addTemplate = useCallback((template: HabitTemplate) => {
    const activeTemplate = createActiveTemplate(template);
    
    setActiveTemplates(prev => {
      const exists = prev.some(t => t.templateId === activeTemplate.templateId);
      if (exists) {
        toast.error('Template already exists');
        return prev;
      }
      
      console.log('Adding template:', activeTemplate);
      toast.success('Template added successfully');
      return [...prev, activeTemplate];
    });
  }, [createActiveTemplate]);

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

  const deleteCustomTemplate = useCallback((templateId: string) => {
    setCustomTemplates(prev => {
      const filtered = prev.filter(template => template.id !== templateId);
      // Also remove from active templates if it exists there
      setActiveTemplates(prevActive => 
        prevActive.filter(template => template.templateId !== templateId)
      );
      return filtered;
    });
  }, []);

  const saveCustomTemplate = useCallback((template: NewTemplate): HabitTemplate => {
    if (!template.defaultHabits || template.defaultHabits.length === 0) {
      toast.error('Template must have at least one habit');
      throw new Error('Template must have at least one habit');
    }

    const newTemplate: HabitTemplate = {
      id: `template-${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      defaultHabits: template.defaultHabits,
      defaultDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
      duration: template.duration || null,
    };

    setCustomTemplates(prev => [...prev, newTemplate]);
    
    // Use the same addTemplate function here
    addTemplate(newTemplate);
    
    console.log('Created custom template:', newTemplate);
    toast.success('Custom template created successfully');
    
    return newTemplate;
  }, [addTemplate]);

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
    customTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    saveCustomTemplate,
    deleteCustomTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  };
};
