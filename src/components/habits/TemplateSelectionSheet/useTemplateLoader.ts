import { useState, useEffect } from 'react';
import { HabitTemplate } from '@/types/habit';

export const useTemplateLoader = (isOpen: boolean) => {
  const [customTemplates, setCustomTemplates] = useState<HabitTemplate[]>([]);

  // Load custom templates from local storage
  useEffect(() => {
    const loadCustomTemplates = () => {
      try {
        const saved = localStorage.getItem('custom-templates');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Error loading custom templates:', error);
        return [];
      }
    };

    setCustomTemplates(loadCustomTemplates());

    // Also listen for template updates
    const handleTemplatesUpdated = () => {
      setCustomTemplates(loadCustomTemplates());
    };

    window.addEventListener('templatesUpdated', handleTemplatesUpdated);

    return () => {
      window.removeEventListener('templatesUpdated', handleTemplatesUpdated);
    };
  }, [isOpen]); // Reload when sheet opens

  return { customTemplates, setCustomTemplates };
};
