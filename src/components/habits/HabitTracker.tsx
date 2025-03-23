
import React, { useState, useEffect } from 'react';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';
import { useHabitContext } from '@/contexts/habits/HabitContext';
import ActiveTemplateList from '@/components/habits/ActiveTemplateList';
import HabitTemplateManager from '@/components/habits/HabitTemplateManager';
import { DayOfWeek, ActiveTemplate, HabitTemplate } from './types';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitTaskIntegration } from '@/hooks/habits/useHabitTaskIntegration';
import { EventType, EventCallback } from '@/types/events';
import { motion } from 'framer-motion';

/**
 * Main component for habit tracking and template management
 */
const HabitTracker: React.FC = () => {
  const { templates } = useHabitContext();
  const { addTemplate, removeTemplate, updateTemplateDays } = useHabitContext();
  const [templateMap, setTemplateMap] = useState<Record<string, HabitTemplate>>({});
  const [processingTemplateId, setProcessingTemplateId] = useState<string | null>(null);
  
  // Use the habit-task integration hook
  const { syncHabitsWithTasks } = useHabitTaskIntegration();
  
  // Build a map of template data for quick lookup
  useEffect(() => {
    const map: Record<string, HabitTemplate> = {};
    habitTemplates.forEach(template => {
      map[template.id] = template;
    });
    setTemplateMap(map);
  }, []);
  
  // Debug logging for templates
  useEffect(() => {
    console.log(`HabitTracker: Active templates count: ${templates.length}`);
    templates.forEach((template, index) => {
      console.log(`Template ${index + 1}: ${template.templateId} with ${template.habits?.length || 0} habits`);
      
      // Check if this template should be active today
      const today = new Date().getDay();
      const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const todayStr = days[today];
      const isActiveToday = template.activeDays?.includes(todayStr);
      
      console.log(`  Active days: ${template.activeDays?.join(', ')}, active today: ${isActiveToday}`);
    });
    
    // If templates change, trigger habit-task sync
    syncHabitsWithTasks();
    
    // Force UI refresh with staggered timing
    setTimeout(() => {
      window.dispatchEvent(new Event('force-habits-update'));
      
      // Trigger task updates as well
      setTimeout(() => {
        window.dispatchEvent(new Event('force-task-update'));
        
        // Check for pending habits
        eventManager.emit('habits:check-pending' as EventType, {});
      }, 200);
    }, 100);
  }, [templates, syncHabitsWithTasks]);
  
  // Event listeners for template management
  useEffect(() => {
    // Handler for template add events
    const handleTemplateAdd: EventCallback<any> = (payload: any) => {
      console.log("HabitTracker: Detected template add event for", payload);
      const templateId = payload.templateId || payload.id;
      
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
          customized: false,
          name: template.name,
          description: template.description
        };
        
        console.log("Adding template:", activeTemplate);
        addTemplate(activeTemplate);
        
        // Sync habits with tasks after adding template
        setTimeout(() => {
          syncHabitsWithTasks();
        }, 500);
        
        // Clear processing flag after a delay
        setTimeout(() => {
          setProcessingTemplateId(null);
        }, 500);
      } else {
        // Clear processing flag if template not found
        setProcessingTemplateId(null);
      }
    };
    
    // Subscribe to events using eventManager
    const unsubAdd = eventManager.on('habit:template-add' as EventType, handleTemplateAdd);
    
    return () => {
      unsubAdd();
    };
  }, [addTemplate, templates, templateMap, processingTemplateId, syncHabitsWithTasks]);

  // Handle template removal
  const handleRemoveTemplate = (templateId: string) => {
    console.log(`Removing template: ${templateId}`);
    removeTemplate(templateId);
    toast.success('Template removed');
    
    // Also remove all tasks from this template
    eventManager.emit('habit:template-delete' as EventType, { templateId, isOriginatingAction: true });
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="glass-panel p-5 flex flex-col h-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <HabitTemplateManager 
          activeTemplates={templates} 
          onAddTemplate={addTemplate}
          onRemoveTemplate={handleRemoveTemplate}
          onConfigureTemplate={(template) => {
            // Placeholder for template configuration
            console.log("Configure template:", template);
          }}
        />
      </motion.div>
      
      <motion.div 
        className="mt-6 flex-grow overflow-hidden"
        variants={itemVariants}
      >
        <ActiveTemplateList
          activeTemplates={templates}
          onRemove={handleRemoveTemplate}
          getTodayProgress={getHabitProgress}
          onHabitUpdate={handleHabitUpdate}
        />
      </motion.div>
    </motion.div>
  );
};

export default HabitTracker;
