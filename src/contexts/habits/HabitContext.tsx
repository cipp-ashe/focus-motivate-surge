import React, { createContext, useContext, useState, useEffect } from 'react';
import { ActiveTemplate, HabitTemplate } from '@/types/habits/types';
import { eventManager } from '@/lib/events/EventManager';

// Define context type
interface HabitContextProps {
  templates: ActiveTemplate[];
  customTemplates: HabitTemplate[];
  addTemplate: (template: Partial<ActiveTemplate> & { templateId: string }) => void;
  updateTemplate: (template: { templateId: string; name?: string; description?: string; habits?: any[]; activeDays?: string[]; customized?: boolean; suppressToast?: boolean; }) => void;
  removeTemplate: (templateId: string) => void;
  addCustomTemplate: (template: HabitTemplate) => void;
  removeCustomTemplate: (templateId: string) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (data: { templateId: string; activeDays: string[] }) => void;
}

// Create context with default values
const HabitContext = createContext<HabitContextProps>({
  templates: [],
  customTemplates: [],
  addTemplate: () => {},
  updateTemplate: () => {},
  removeTemplate: () => {},
  addCustomTemplate: () => {},
  removeCustomTemplate: () => {},
  updateTemplateOrder: () => {},
  updateTemplateDays: () => {},
});

// Create context provider
export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<ActiveTemplate[]>(() => {
    try {
      const storedTemplates = localStorage.getItem('activeTemplates');
      return storedTemplates ? JSON.parse(storedTemplates) : [];
    } catch (error) {
      console.error("Error loading templates from localStorage:", error);
      return [];
    }
  });
  
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>(() => {
    try {
      const storedTemplates = localStorage.getItem('customTemplates');
      return storedTemplates ? JSON.parse(storedTemplates) : [];
    } catch (error) {
      console.error("Error loading custom templates from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('activeTemplates', JSON.stringify(templates));
  }, [templates]);
  
  useEffect(() => {
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  const addTemplate = (template: Partial<ActiveTemplate> & { templateId: string }) => {
    setTemplates(prevTemplates => {
      const newTemplate = { ...template, customized: false };
      return [...prevTemplates, newTemplate as ActiveTemplate];
    });
    
    // Emit event for other listeners
    eventManager.emit('habit:template-add', template);
  };

  const updateTemplate = (template: { templateId: string; name?: string; description?: string; habits?: any[]; activeDays?: string[]; customized?: boolean; suppressToast?: boolean; }) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(t => {
        if (t.templateId === template.templateId) {
          return { ...t, ...template, customized: true };
        }
        return t;
      });
    });
    
    // Emit event for other listeners
    eventManager.emit('habit:template-update', template);
  };

  const removeTemplate = (templateId: string) => {
    setTemplates(prevTemplates => {
      const updatedTemplates = prevTemplates.filter(template => template.templateId !== templateId);
      return updatedTemplates;
    });
    
    // Emit event for other listeners
    eventManager.emit('habit:template-delete', { templateId, isOriginatingAction: true });
  };
  
  const addCustomTemplate = (template: HabitTemplate) => {
    setCustomTemplates(prevTemplates => [...prevTemplates, template]);
  };
  
  const removeCustomTemplate = (templateId: string) => {
    setCustomTemplates(prevTemplates => prevTemplates.filter(template => template.id !== templateId));
    
    // Also remove from active templates if it's there
    setTemplates(prevTemplates => prevTemplates.filter(template => template.templateId !== templateId));
  };

  const updateTemplateOrder = (templates: ActiveTemplate[]) => {
    setTemplates(templates);
    
    // Emit event for other listeners
    eventManager.emit('habit:template-order-update', templates);
  };

  const updateTemplateDays = (data: { templateId: string; activeDays: string[] }) => {
    setTemplates(prevTemplates => {
      return prevTemplates.map(template => {
        if (template.templateId === data.templateId) {
          return {
            ...template,
            activeDays: data.activeDays,
            customized: true
          };
        }
        return template;
      });
    });

    // Also emit the event for other listeners
    eventManager.emit('habit:template-days-update', data);
  };

  return (
    <HabitContext.Provider value={{ templates, customTemplates, addTemplate, updateTemplate, removeTemplate, addCustomTemplate, removeCustomTemplate, updateTemplateOrder, updateTemplateDays }}>
      {children}
    </HabitContext.Provider>
  );
};

// Create custom hook to use context
export const useHabitContext = () => useContext(HabitContext);
