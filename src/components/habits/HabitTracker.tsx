
import React, { useState, useEffect } from 'react';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
import { HabitTemplateManager, HabitDebugLogger, ActiveTemplateList } from '@/components/habits';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitProgress } from '@/hooks/habits/useHabitProgress';
import { useEvent } from '@/hooks/useEvent';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { removeTemplate, addTemplate } = useHabitActions();
  const { getTodayProgress, updateProgress } = useHabitProgress();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  
  // Force rerender when templates change
  useEffect(() => {
    const handleTemplatesUpdated = () => {
      console.log("HabitTracker: Detected templates updated event");
      setForceUpdate(prev => prev + 1);
    };
    
    const handleForceHabitsUpdate = () => {
      console.log("HabitTracker: Detected force-habits-update event");
      setForceUpdate(prev => prev + 1);
    };
    
    // Listen for template changes via custom event
    window.addEventListener('templatesUpdated', handleTemplatesUpdated);
    window.addEventListener('force-habits-update', handleForceHabitsUpdate);
    
    // Clean up listeners
    return () => {
      window.removeEventListener('templatesUpdated', handleTemplatesUpdated);
      window.removeEventListener('force-habits-update', handleForceHabitsUpdate);
    };
  }, []);

  // Use the useEvent hook for template events
  useEvent('habit:template-update', () => {
    console.log("HabitTracker: Detected template update via event manager");
    setForceUpdate(prev => prev + 1);
    
    // Force habit processing to create tasks
    setTimeout(() => {
      eventManager.emit('habits:processed', {});
    }, 100);
  });
  
  useEvent('habit:template-delete', () => {
    console.log("HabitTracker: Detected template delete via event manager");
    setForceUpdate(prev => prev + 1);
  });

  useEvent('habit:template-add', (templateId: string) => {
    console.log("HabitTracker: Detected template add event for", templateId);
    const templateToAdd = {
      templateId,
      habits: [],
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      customized: false
    };
    addTemplate(templateToAdd);
    setForceUpdate(prev => prev + 1);
  });

  // Handler for removing templates
  const handleRemoveTemplate = (templateId: string) => {
    console.log(`HabitTracker: Initiating template deletion for ${templateId}`);
    
    try {
      // Call the removeTemplate action directly
      removeTemplate(templateId);
      
      // Also emit the event to ensure all components are notified
      eventManager.emit('habit:template-delete', { 
        templateId, 
        isOriginatingAction: true 
      });
      
      // Force an update of the task list
      setTimeout(() => {
        console.log('HabitTracker: Forcing global update after template removal');
        window.dispatchEvent(new Event('force-task-update'));
        window.dispatchEvent(new Event('force-habits-update'));
      }, 50);
    } catch (error) {
      console.error('Error removing template:', error);
    }
  };

  // Handler for updating habits in templates
  const handleHabitUpdate = (habitId: string, templateId: string, value: boolean | number) => {
    updateProgress(habitId, templateId, value);
    
    // If a habit is completed, trigger habit processing to ensure tasks are updated
    if (value) {
      setTimeout(() => {
        eventManager.emit('habits:processed', {});
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Manager */}
      <HabitTemplateManager activeTemplates={templates} />
      
      {/* Active Templates List */}
      <div className="mt-6">
        <ActiveTemplateList
          activeTemplates={templates}
          onRemove={handleRemoveTemplate}
          getTodayProgress={getTodayProgress}
          onHabitUpdate={handleHabitUpdate}
        />
      </div>

      {debugMode && (
        <HabitDebugLogger templates={templates} todaysHabits={[]} />
      )}
    </div>
  );
};

export default HabitTracker;
