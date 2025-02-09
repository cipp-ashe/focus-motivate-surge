
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Check, AlertOctagon, X } from 'lucide-react';
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
      const exists = prev.some(t => t.templateId === template.templateId);
      if (exists) {
        toast.error('Template already exists', {
          icon: <AlertOctagon className="h-5 w-5" />,
          duration: 2000,
        });
        return prev;
      }
      
      const newTemplate = {
        ...template,
        habits: template.habits,
        activeDays: template.activeDays || DEFAULT_ACTIVE_DAYS,
      };
      
      console.log('Adding template:', newTemplate);
      toast.success('Template added successfully', {
        icon: <Check className="h-5 w-5" />,
        duration: 2000,
      });
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
    toast.success('Template removed', {
      icon: <Check className="h-5 w-5" />,
      duration: 2000,
    });
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
      toast.error('Template must have at least one habit', {
        icon: <X className="h-5 w-5" />,
        duration: 2000,
      });
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

    setCustomTemplates(prev => {
      const updated = [...prev, newTemplate];
      return updated;
    });

    // Automatically add the custom template to active templates
    const activeTemplate: ActiveTemplate = {
      templateId: newTemplate.id,
      habits: newTemplate.defaultHabits,
      activeDays: newTemplate.defaultDays || DEFAULT_ACTIVE_DAYS,
      customized: false,
    };
    
    addTemplate(activeTemplate);
    console.log('Created custom template:', newTemplate);
    console.log('Added as active template:', activeTemplate);
    
    toast.success('Custom template created successfully', {
      icon: <Check className="h-5 w-5" />,
      duration: 2000,
    });
    
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
