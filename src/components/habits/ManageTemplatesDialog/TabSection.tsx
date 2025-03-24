
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getRecommendedTemplates } from '@/data/recommendedTemplates';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TemplateCard } from '../TemplateCard';
import { NewTemplateForm } from './NewTemplateForm';
import { CustomTemplatesList } from './CustomTemplatesList';
import { HabitTemplate, NewTemplate } from '@/types/habits/types';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { toast } from 'sonner';

export const TabSection = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const { templates, addTemplate, customTemplates, addCustomTemplate, removeCustomTemplate } = useHabitContext();
  const [recommendedTemplates, setRecommendedTemplates] = useState<HabitTemplate[]>(getRecommendedTemplates());
  
  // Handle adding a template to active templates
  const handleAddTemplate = (template: HabitTemplate) => {
    // Check if already added
    const exists = templates.some(t => t.templateId === template.id);
    if (exists) {
      toast.error('Template already added');
      return;
    }
    
    // Add template to active templates
    addTemplate({
      templateId: template.id,
      name: template.name,
      description: template.description,
      habits: template.defaultHabits,
      activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      customized: false
    });
    
    toast.success(`${template.name} template added`);
  };
  
  // Handle creating a new custom template
  const handleCreateTemplate = (template: NewTemplate) => {
    // Create a unique ID
    const templateId = `custom-${Date.now()}`;
    
    // Create the template object
    const newTemplate: HabitTemplate = {
      id: templateId,
      name: template.name,
      description: template.description,
      category: template.category,
      defaultHabits: template.habits,
      defaultDays: template.defaultDays
    };
    
    // Add to custom templates
    addCustomTemplate(newTemplate);
    
    // Add to active templates
    addTemplate({
      templateId,
      name: template.name,
      description: template.description,
      habits: template.habits,
      activeDays: template.defaultDays,
      customized: true
    });
    
    toast.success('Custom template created and added');
    
    // Switch to the custom tab to show the new template
    setActiveTab('custom');
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="recommended">Recommended</TabsTrigger>
        <TabsTrigger value="custom">My Templates</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recommended" className="h-[50vh]">
        <ScrollArea className="h-full pr-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                isActive={templates.some(t => t.templateId === template.id)}
                onSelect={() => handleAddTemplate(template)}
              />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="custom" className="h-[50vh]">
        <CustomTemplatesList
          templates={customTemplates}
          activeTemplateIds={templates.map(t => t.templateId)}
          onAddTemplate={handleAddTemplate}
          onRemoveTemplate={removeCustomTemplate}
        />
      </TabsContent>
      
      <TabsContent value="create" className="h-[50vh]">
        <NewTemplateForm onCreateTemplate={handleCreateTemplate} />
      </TabsContent>
    </Tabs>
  );
};
