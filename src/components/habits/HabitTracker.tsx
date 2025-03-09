
import React, { useState } from 'react';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
import { useTodaysHabits, useHabitEvents, useHabitProgress } from '@/hooks/habits';
import { HabitTemplateManager, HabitDebugLogger, ActiveTemplateList } from '@/components/habits';
import { eventBus } from '@/lib/eventBus';

const HabitTracker = () => {
  const { templates } = useHabitState();
  const { removeTemplate } = useHabitActions();
  const { todaysHabits } = useTodaysHabits(templates);
  const { getTodayProgress, updateProgress } = useHabitProgress();
  useHabitEvents();

  const [debugMode, setDebugMode] = useState(false);

  // Handler for removing templates
  const handleRemoveTemplate = (templateId: string) => {
    removeTemplate(templateId);
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
