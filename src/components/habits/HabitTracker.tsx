import React, { useState, useEffect } from 'react';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
import { HabitTemplateManager, HabitDebugLogger, ActiveTemplateList } from '@/components/habits';
import { eventManager } from '@/lib/events/EventManager';
import { useHabitProgress } from '@/hooks/habits/useHabitProgress';
import { useEvent } from '@/hooks/useEvent';
import { DayOfWeek } from '@/components/habits/types';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { removeTemplate, addTemplate } = useHabitActions();
  const { getTodayProgress, updateProgress } = useHabitProgress();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  
  useEffect(() => {
    const handleTemplatesUpdated = () => {
      console.log("HabitTracker: Detected templates updated event");
      setForceUpdate(prev => prev + 1);
    };
    
    const handleForceHabitsUpdate = () => {
      console.log("HabitTracker: Detected force-habits-update event");
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('templatesUpdated', handleTemplatesUpdated);
    window.addEventListener('force-habits-update', handleForceHabitsUpdate);
    
    return () => {
      window.removeEventListener('templatesUpdated', handleTemplatesUpdated);
      window.removeEventListener('force-habits-update', handleForceHabitsUpdate);
    };
  }, []);

  useEvent('habit:template-update', () => {
    console.log("HabitTracker: Detected template update via event manager");
    setForceUpdate(prev => prev + 1);
    
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
      activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as DayOfWeek[],
      customized: false
    };
    addTemplate(templateToAdd);
    setForceUpdate(prev => prev + 1);
  });

  const handleRemoveTemplate = (templateId: string) => {
    console.log(`HabitTracker: Initiating template deletion for ${templateId}`);
    
    try {
      removeTemplate(templateId);
      
      eventManager.emit('habit:template-delete', { 
        templateId, 
        isOriginatingAction: true 
      });
      
      setTimeout(() => {
        console.log('HabitTracker: Forcing global update after template removal');
        window.dispatchEvent(new Event('force-task-update'));
        window.dispatchEvent(new Event('force-habits-update'));
      }, 50);
    } catch (error) {
      console.error('Error removing template:', error);
    }
  };

  const handleHabitUpdate = (habitId: string, templateId: string, value: boolean | number) => {
    updateProgress(habitId, templateId, value);
    
    if (value) {
      setTimeout(() => {
        eventManager.emit('habits:processed', {});
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      <HabitTemplateManager activeTemplates={templates} />
      
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
