
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

  const addTemplate = useCallback((template: ActiveTemplate) => {
    setActiveTemplates(prev => {
      // Check if template already exists
      const exists = prev.some(t => t.templateId === template.templateId);
      if (exists) {
        toast.error('Template already exists');
        return prev;
      }
      
      const newTemplate = {
        ...template,
        habits: template.habits || [],
        activeDays: template.activeDays || DEFAULT_ACTIVE_DAYS,
      };
      
      const newTemplates = [...prev, newTemplate];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
      console.log('Added template:', newTemplate);
      console.log('Current active templates:', newTemplates);
      toast.success('Template added successfully');
      return newTemplates;
    });
  }, []);

  const updateTemplate = useCallback((templateId: string, updates: Partial<ActiveTemplate>) => {
    setActiveTemplates(prev => {
      const updated = prev.map(template =>
        template.templateId === templateId
          ? { ...template, ...updates, customized: true }
          : template
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeTemplate = useCallback((templateId: string) => {
    setActiveTemplates(prev => {
      const filtered = prev.filter(template => template.templateId !== templateId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  const deleteCustomTemplate = useCallback((templateId: string) => {
    setCustomTemplates(prev => {
      const filtered = prev.filter(template => template.id !== templateId);
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(filtered));
      // Also remove from active templates if it exists there
      setActiveTemplates(prevActive => 
        prevActive.filter(template => template.templateId !== templateId)
      );
      return filtered;
    });
  }, []);

  const saveCustomTemplate = useCallback((template: NewTemplate): HabitTemplate => {
    const newTemplate: HabitTemplate = {
      id: `template-${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      defaultHabits: template.defaultHabits || [{
        id: `habit-${Date.now()}`,
        name: 'New Habit',
        description: 'Description of your new habit',
        category: template.category,
        timePreference: 'Anytime',
        metrics: { type: 'boolean' },
        insights: [],
        tips: []
      }],
      defaultDays: template.defaultDays || DEFAULT_ACTIVE_DAYS,
      duration: template.duration || null,
    };

    setCustomTemplates(prev => {
      const updated = [...prev, newTemplate];
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
      return updated;
    });

    // Automatically add the custom template to active templates
    const activeTemplate: ActiveTemplate = {
      templateId: newTemplate.id,
      habits: newTemplate.defaultHabits || [],
      activeDays: newTemplate.defaultDays || DEFAULT_ACTIVE_DAYS,
      customized: false,
    };
    
    addTemplate(activeTemplate);
    console.log('Created and added custom template:', activeTemplate);
    return newTemplate;
  }, [addTemplate]);

  const updateTemplateOrder = useCallback((templates: ActiveTemplate[]) => {
    setActiveTemplates(templates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, []);

  const updateTemplateDays = useCallback((templateId: string, days: DayOfWeek[]) => {
    setActiveTemplates(prev => {
      const updated = prev.map(template =>
        template.templateId === templateId
          ? { ...template, activeDays: days, customized: true }
          : template
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

