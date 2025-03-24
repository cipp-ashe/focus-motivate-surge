
import { useState } from 'react';
import { ActiveTemplate, HabitTemplate, DayOfWeek } from '@/components/habits/types';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';

export const useTemplateCreation = (
  addTemplate: (template: ActiveTemplate) => void,
  updateTemplate: (templateId: string, template: Partial<ActiveTemplate>) => void,
) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleCreateTemplate = () => {
    const newTemplate: ActiveTemplate = {
      templateId: `custom-${Date.now()}`,
      name: 'New Template', // Add required name property
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
      // Create a unique ID for the template
      const templateId = `custom-${Date.now()}`;
      
      // Create the template object for storage
      const customTemplate: HabitTemplate = {
        id: templateId,
        name: newTemplateName,
        description: 'Custom template',
        category: 'Custom',
        defaultHabits: selectedTemplate.habits,
        defaultDays: selectedTemplate.activeDays,
        duration: null,
      };

      // Save the custom template
      const existingTemplatesStr = localStorage.getItem('custom-templates');
      const existingTemplates = existingTemplatesStr ? JSON.parse(existingTemplatesStr) : [];
      const updatedTemplates = [...existingTemplates, customTemplate];
      localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));

      // Emit event for custom template creation with suppressToast
      eventBus.emit('habit:custom-template-create', { ...customTemplate, suppressToast: true });

      // Add the template to active templates
      const activeTemplate: ActiveTemplate = { 
        templateId: templateId,
        habits: selectedTemplate.habits,
        activeDays: selectedTemplate.activeDays,
        customized: true,
        name: newTemplateName,  // Make sure we keep the name
        description: 'Custom template' // Include the description
      };
      
      // Add template to active templates - show toast here only
      addTemplate(activeTemplate);
      toast.success('Template created and added successfully');
      
      handleCloseTemplate();
      
      // Emit the event with suppressToast to prevent duplicate toasts
      eventBus.emit('habit:template-update', { ...activeTemplate, suppressToast: true });
      window.dispatchEvent(new Event('templatesUpdated'));
      window.dispatchEvent(new Event('force-habits-update'));
    } else {
      // Update existing template - only show toast here
      updateTemplate(selectedTemplate.templateId, selectedTemplate);
      toast.success('Template updated successfully');
      handleCloseTemplate();
      window.dispatchEvent(new Event('templatesUpdated'));
      window.dispatchEvent(new Event('force-habits-update'));
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
