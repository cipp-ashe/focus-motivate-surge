
import React, { useState, useEffect, useRef } from 'react';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
import { HabitTemplateManager, HabitDebugLogger, ActiveTemplateList } from '@/components/habits';
import { eventBus } from '@/lib/eventBus';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { removeTemplate } = useHabitActions();
  const { getTodayProgress, updateProgress } = useHabitProgress();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Use the useHabitState hook directly without trying to access a non-existent state property
  const habitState = useHabitState();
  
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
    
    window.addEventListener('templatesUpdated', handleTemplatesUpdated);
    window.addEventListener('force-habits-update', handleForceHabitsUpdate);
    
    return () => {
      window.removeEventListener('templatesUpdated', handleTemplatesUpdated);
      window.removeEventListener('force-habits-update', handleForceHabitsUpdate);
    };
  }, []);

  // Handler for removing templates
  const handleRemoveTemplate = (templateId: string) => {
    console.log(`HabitTracker: Removing template ${templateId} and its associated tasks`);
    
    // First emit event to remove any tasks associated with this template
    eventBus.emit('habit:template-delete', { templateId });
    
    // Then remove the template from state
    removeTemplate(templateId);
    
    // Force an update of the task list
    setTimeout(() => {
      console.log('HabitTracker: Forcing global update after template removal');
      window.dispatchEvent(new Event('force-task-update'));
      window.dispatchEvent(new Event('force-habits-update'));
    }, 50);
  };

  // Handler for updating habits in templates
  const handleHabitUpdate = (habitId: string, templateId: string, value: boolean | number) => {
    updateProgress(habitId, templateId, value);
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

// Add the import at the top
import { useHabitProgress } from '@/hooks/habits';

export default HabitTracker;
