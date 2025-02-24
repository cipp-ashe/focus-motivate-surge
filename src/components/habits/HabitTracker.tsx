
import React, { useState } from 'react';
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { useTemplateCreation } from './hooks/useTemplateCreation';
import { HabitTemplate, ActiveTemplate } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { eventBus } from '@/lib/eventBus';

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
  onConfigureTemplates?: () => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  activeTemplates,
  onConfigureTemplates 
}) => {
  const {
    getTodayProgress,
    updateProgress,
  } = useHabitProgress();

  const {
    selectedTemplate,
    isCreatingTemplate,
    newTemplateName,
    setNewTemplateName,
    handleCreateTemplate,
    handleConfigureTemplate,
    handleCloseTemplate,
    handleSaveTemplate,
  } = useTemplateCreation(() => {}, () => {});

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <HabitTrackerHeader onConfigureTemplates={onConfigureTemplates} />

      <ActiveTemplateList
        activeTemplates={activeTemplates}
        getTodayProgress={getTodayProgress}
        onHabitUpdate={updateProgress}
        onRemove={(templateId) => {
          eventBus.emit('habit:template-delete', { templateId });
        }}
      />
    </div>
  );
};

export default HabitTracker;
