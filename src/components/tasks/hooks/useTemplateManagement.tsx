
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';

// Add HabitTemplate type
interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  schedule: string;
  tags: string[];
  active: boolean;
}

export const useTemplateManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateData, setTemplateData] = useState<HabitTemplate>({
    id: uuidv4(),
    name: '',
    description: '',
    schedule: '',
    tags: [],
    active: true
  });
  const [isNewTemplate, setIsNewTemplate] = useState(true);

  const handleTemplateSave = () => {
    const newTemplate: HabitTemplate = {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description,
      schedule: templateData.schedule,
      tags: templateData.tags,
      active: templateData.active,
    };
    
    if (isNewTemplate) {
      eventBus.emit('habit:template-add' as any, newTemplate);
      toast.success("Habit template created.", {
        duration: 3000,
      });
    } else {
      eventBus.emit('habit:template-update' as any, newTemplate);
      toast.success("Habit template updated.", {
        duration: 3000,
      });
    }
    
    setDialogOpen(false);
  };
  
  const handleTemplateDelete = () => {
    console.log('Deleting template:', templateData);
    eventBus.emit('habit:template-delete' as any, { templateId: templateData.id });
    setDialogOpen(false);
    toast.success("Habit template deleted.", {
      duration: 3000,
    });
  };
  
  const handleTemplateCreate = () => {
    setTemplateData({
      id: uuidv4(),
      name: '',
      description: '',
      schedule: '',
      tags: [],
      active: true
    });
    setIsNewTemplate(true);
    setDialogOpen(true);
  };

  return {
    dialogOpen,
    setDialogOpen,
    templateData,
    setTemplateData,
    isNewTemplate,
    setIsNewTemplate,
    handleTemplateSave,
    handleTemplateDelete,
    handleTemplateCreate
  };
};
