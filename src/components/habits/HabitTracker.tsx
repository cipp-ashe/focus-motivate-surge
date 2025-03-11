
import React, { useState, useEffect } from 'react';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
import ActiveTemplateList from '@/components/habits/ActiveTemplateList';
import HabitTemplateManager from '@/components/habits/HabitTemplateManager';
import { DayOfWeek, ActiveTemplate, HabitTemplate } from './types';
import { eventBus } from '@/lib/eventBus';

/**
 * Main component for habit tracking and template management
 */
const HabitTracker: React.FC = () => {
  const { templates } = useHabitState();
  const { addTemplate, removeTemplate, updateTemplateDays } = useHabitActions();
  const [templateMap, setTemplateMap] = useState<Record<string, HabitTemplate>>({});
  const [processingTemplateId, setProcessingTemplateId] = useState<string | null>(null);
  
  // Build a map of template data for quick lookup
  useEffect(() => {
    const map: Record<string, HabitTemplate> = {};
    habitTemplates.forEach(template => {
      map[template.id] = template;
    });
    setTemplateMap(map);
  }, []);
  
  // Event listeners for template management
  useEffect(() => {
    const handleTemplateAdd = (templateId: string) => {
      console.log("HabitTracker: Detected template add event for", templateId);
      
      // Prevent duplicate processing of the same template
      if (processingTemplateId === templateId) {
        console.log("Already processing this template, ignoring duplicate event");
        return;
      }
      
      // Check if this template already exists
      if (templates.some(t => t.templateId === templateId)) {
        console.log("Template already exists, not adding again:", templateId);
        return;
      }
      
      // Set processing flag to prevent duplicate adds
      setProcessingTemplateId(templateId);
      
      // Add the template if it doesn't exist
      const template = templateMap[templateId];
      if (template) {
        // Create active template from template data
        const activeTemplate: ActiveTemplate = {
          templateId: template.id,
          habits: template.defaultHabits || [],
          activeDays: template.defaultDays as DayOfWeek[] || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          customized: false
        };
        
        console.log("Adding template:", activeTemplate);
        addTemplate(activeTemplate);
        
        // Clear processing flag after a delay
        setTimeout(() => {
          setProcessingTemplateId(null);
        }, 500);
      } else {
        // Clear processing flag if template not found
        setProcessingTemplateId(null);
      }
    };
    
    const handleTemplateUpdate = (data: any) => {
      console.log("HabitTracker: Detected template update via event manager");
      // This event is handled by the HabitContext directly, no need to duplicate logic
    };

    // Subscribe to events
    const unsubAdd = eventBus.on('habit:template-add', handleTemplateAdd);
    const unsubUpdate = eventBus.on('habit:template-update', handleTemplateUpdate);
    
    return () => {
      unsubAdd();
      unsubUpdate();
    };
  }, [addTemplate, templates, templateMap, processingTemplateId]);

  // Handle template removal
  const handleRemoveTemplate = (templateId: string) => {
    removeTemplate(templateId);
    toast.success('Template removed');
  };

  // Track habit progress (placeholder for now)
  const getHabitProgress = (habitId: string, templateId: string) => {
    return { value: false, streak: 0 };
  };

  // Handle habit completion (placeholder for now)
  const handleHabitUpdate = (habitId: string, templateId: string, value: boolean | number) => {
    toast.success('Habit updated');
  };

  // Handle updating template active days
  const handleUpdateDays = (templateId: string, days: DayOfWeek[]) => {
    updateTemplateDays(templateId, days);
    toast.success('Template days updated');
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-4">
      <HabitTemplateManager activeTemplates={templates} />
      
      <div className="mt-6">
        <ActiveTemplateList
          activeTemplates={templates}
          onRemove={handleRemoveTemplate}
          getTodayProgress={getHabitProgress}
          onHabitUpdate={handleHabitUpdate}
        />
      </div>
    </div>
  );
};

export default HabitTracker;
