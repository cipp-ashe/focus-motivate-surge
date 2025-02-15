
import { useState } from 'react';
import { ActiveTemplate, HabitTemplate, DayOfWeek } from '../types';
import { toast } from 'sonner';

export const useTemplateCreation = (
  addTemplate: (template: ActiveTemplate) => void,
  updateTemplate: (templateId: string, template: ActiveTemplate) => void,
) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleCreateTemplate = () => {
    const newTemplate: ActiveTemplate = {
      templateId: `custom-${Date.now()}`,
      habits: [],
      customized: true,
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    };
    setSelectedTemplate(newTemplate);
    setIsCreatingTemplate(true);
    setNewTemplateName('');
  };

  const handleConfigureTemplate = (template: ActiveTemplate) => {
    setSelectedTemplate(template);
    setIsCreatingTemplate(false);
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
    setIsCreatingTemplate(false);
    setNewTemplateName('');
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplate) return;
    
    if (!newTemplateName.trim() && isCreatingTemplate) {
      toast.error('Please enter a template name');
      return;
    }

    if (!selectedTemplate.habits?.length) {
      toast.error('Please add at least one habit');
      return;
    }

    if (isCreatingTemplate) {
      const customTemplate: HabitTemplate = {
        id: selectedTemplate.templateId,
        name: newTemplateName,
        description: 'Custom template',
        category: 'Custom',
        defaultHabits: selectedTemplate.habits,
        defaultDays: selectedTemplate.activeDays,
        duration: null,
      };

      const existingTemplatesStr = localStorage.getItem('custom-templates');
      const existingTemplates = existingTemplatesStr ? JSON.parse(existingTemplatesStr) : [];
      const updatedTemplates = [...existingTemplates, customTemplate];
      localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));

      const updatedTemplate = { 
        ...selectedTemplate,
        name: newTemplateName,
        customized: true,
      };
      addTemplate(updatedTemplate);
      toast.success('Template saved successfully');
      handleCloseTemplate();
      window.dispatchEvent(new Event('templatesUpdated'));
    } else {
      updateTemplate(selectedTemplate.templateId, selectedTemplate);
      toast.success('Template updated successfully');
      handleCloseTemplate();
      window.dispatchEvent(new Event('templatesUpdated'));
    }
  };

  return {
    selectedTemplate,
    isCreatingTemplate,
    newTemplateName,
    setNewTemplateName,
    handleCreateTemplate,
    handleConfigureTemplate,
    handleCloseTemplate,
    handleSaveTemplate,
  };
};
