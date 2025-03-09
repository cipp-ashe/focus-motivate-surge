
import React, { useState, useEffect } from 'react';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
import { useTodaysHabits, useHabitProgress } from '@/hooks/habits';
import { HabitTemplateManager, HabitDebugLogger, ActiveTemplateList } from '@/components/habits';
import { eventBus } from '@/lib/eventBus';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { removeTemplate } = useHabitActions();
  const { todaysHabits } = useTodaysHabits(templates);
  const { getTodayProgress, updateProgress } = useHabitProgress();
  
  // Call useHabitEvents with the correct dependency
  const { state } = useHabitState();
  
  const [debugMode, setDebugMode] = useState(false);

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
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      )}
    </div>
  );
};

export default HabitTracker;
