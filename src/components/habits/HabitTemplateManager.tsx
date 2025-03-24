
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import TemplateSelectionSheet from './TemplateSelectionSheet';
import { ActiveTemplate } from '@/types/habits/types';
import { PlusCircle } from 'lucide-react';
import ActiveTemplateList from './ActiveTemplateList';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { habitTemplates } from '../../utils/habitTemplates';

export interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
  addTemplate: (template: any) => void;
  removeTemplate: (templateId: string) => void;
  configureTemplate: (template: any) => void;
}

export const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({
  activeTemplates,
  addTemplate,
  removeTemplate,
  configureTemplate
}) => {
  const [isTemplateSheetOpen, setIsTemplateSheetOpen] = useState(false);
  const { templates } = useHabitContext();
  
  // Get active template IDs for comparison
  const activeTemplateIds = templates.map(t => t.templateId);
  
  // Load custom templates from storage
  const customTemplatesStr = localStorage.getItem('custom-templates') || '[]';
  const customTemplates = JSON.parse(customTemplatesStr);
  
  const handleDeleteCustomTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
    
    // If the template is active, also remove it from the active templates
    if (activeTemplateIds.includes(templateId)) {
      removeTemplate(templateId);
    }
  };
  
  const handleCreateTemplate = (template: any) => {
    // Create the template and add it to the custom templates
    const newTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      icon: '✨',
      color: '#5f6caf',
      category: 'Custom'
    };
    
    const updatedTemplates = [...customTemplates, newTemplate];
    localStorage.setItem('custom-templates', JSON.stringify(updatedTemplates));
    
    // Also add it to active templates
    addTemplate({
      templateId: newTemplate.id,
      name: newTemplate.name,
      habits: newTemplate.defaultHabits || [],
      activeDays: newTemplate.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      customized: true
    });
    
    setIsTemplateSheetOpen(false);
  };
  
  // Get Today's progress for each habit
  const getTodayProgress = (habitId: string, templateId: string) => {
    const progressKey = 'habit-progress';
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      return (progress[templateId]?.[habitId]?.[today]) || { value: false, streak: 0 };
    } catch (error) {
      console.error('Error loading progress:', error);
      return { value: false, streak: 0 };
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Habit Templates</h2>
        <Button onClick={() => setIsTemplateSheetOpen(true)} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>
      
      <ActiveTemplateList 
        activeTemplates={activeTemplates}
        onRemoveTemplate={removeTemplate}
        onConfigureTemplate={configureTemplate}
      />
      
      <TemplateSelectionSheet 
        open={isTemplateSheetOpen}
        onOpenChange={setIsTemplateSheetOpen}
        onSelectTemplate={addTemplate}
        onCreateTemplate={handleCreateTemplate}
        existingTemplateIds={activeTemplateIds}
      />
    </div>
  );
};

export default HabitTemplateManager;
