
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import TemplateSelectionSheet from './TemplateSelectionSheet';
import { ActiveTemplate } from '@/types/habits';
import { PlusCircle } from 'lucide-react';
import ActiveTemplateList from './ActiveTemplateList';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import { habitTemplates } from '../../utils/habitTemplates';

export interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
  onAddTemplate: (template: any) => void;
  onRemoveTemplate: (templateId: string) => void;
  onConfigureTemplate: (template: any) => void;
}

export const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({
  activeTemplates,
  onAddTemplate,
  onRemoveTemplate,
  onConfigureTemplate
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
      onRemoveTemplate(templateId);
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
    onAddTemplate({
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
  
  // Handle habit completion
  const handleHabitUpdate = (habitId: string, templateId: string, value: boolean | number) => {
    const progressKey = 'habit-progress';
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
      const templateProgress = progress[templateId] || {};
      const habitProgress = templateProgress[habitId] || {};
      
      // Update progress
      progress[templateId] = {
        ...templateProgress,
        [habitId]: {
          ...habitProgress,
          [today]: {
            value,
            streak: habitProgress[today]?.streak || 0,
            date: today,
            completed: !!value
          }
        }
      };
      
      localStorage.setItem(progressKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Habit Templates</h2>
        <Button 
          onClick={() => setIsTemplateSheetOpen(true)} 
          variant="outline" 
          size="sm"
          className="gap-1.5"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Template</span>
        </Button>
      </div>
      
      <ActiveTemplateList 
        activeTemplates={activeTemplates}
        onRemove={onRemoveTemplate}
        getTodayProgress={getTodayProgress}
        onHabitUpdate={handleHabitUpdate}
      />
      
      <TemplateSelectionSheet
        isOpen={isTemplateSheetOpen}
        onOpenChange={setIsTemplateSheetOpen}
        customTemplates={customTemplates}
        activeTemplateIds={activeTemplateIds}
        onSelectTemplate={(template) => {
          onAddTemplate({
            templateId: template.id,
            name: template.name,
            habits: template.defaultHabits,
            activeDays: template.defaultDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            customized: false
          });
          setIsTemplateSheetOpen(false);
        }}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
        onCreateTemplate={handleCreateTemplate}
        onClose={() => setIsTemplateSheetOpen(false)}
        allTemplates={habitTemplates}
      />
    </div>
  );
};
