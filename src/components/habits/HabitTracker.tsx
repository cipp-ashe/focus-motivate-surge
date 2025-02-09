
import React, { useState } from 'react';
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import ConfigurationDialog from './ConfigurationDialog';
import ManageTemplatesDialog from './ManageTemplatesDialog';
import { DialogState, ActiveTemplate } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import DraggableTemplateList from './DraggableTemplateList';

const HabitTracker: React.FC = () => {
  const {
    activeTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  } = useTemplateManagement();

  const {
    getTodayProgress,
    updateProgress,
    getWeeklyProgress,
  } = useHabitProgress();

  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ type: 'customize', open: false });
  const [showInsights, setShowInsights] = useState(false);
  const [insightTemplateId, setInsightTemplateId] = useState<string | null>(null);

  const {
    draggedIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop(activeTemplates, updateTemplateOrder);

  const handleCustomizeTemplate = (template: ActiveTemplate) => {
    setSelectedTemplate({
      ...template,
      activeDays: template.activeDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    });
    setDialog({ type: 'customize', open: true });
  };

  const handleSaveTemplate = (habits: any) => {
    if (selectedTemplate) {
      updateTemplate(selectedTemplate.templateId, { habits });
      setDialog({ type: 'customize', open: false });
      setSelectedTemplate(null);
    }
  };

  const handleToggleInsights = (template: ActiveTemplate) => {
    if (insightTemplateId === template.templateId) {
      setShowInsights(false);
      setInsightTemplateId(null);
    } else {
      setShowInsights(true);
      setInsightTemplateId(template.templateId);
    }
  };

  return (
    <div className="space-y-4">
      <HabitTrackerHeader 
        onAddTemplate={() => setDialog({ type: 'manage', open: true })} 
      />

      <DraggableTemplateList
        activeTemplates={activeTemplates}
        showInsights={showInsights}
        insightTemplateId={insightTemplateId}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onCustomize={handleCustomizeTemplate}
        onRemove={removeTemplate}
        onToggleInsights={handleToggleInsights}
        getTodayProgress={getTodayProgress}
        onHabitUpdate={updateProgress}
        getWeeklyProgress={getWeeklyProgress}
      />

      {dialog.type === 'manage' && (
        <ManageTemplatesDialog
          open={dialog.open}
          onClose={() => setDialog({ type: 'manage', open: false })}
          availableTemplates={habitTemplates}
          activeTemplateIds={activeTemplates.map(t => t.templateId)}
          onSelectTemplate={(template) => {
            addTemplate(template);
            setDialog({ type: 'manage', open: false });
          }}
        />
      )}

      {selectedTemplate && dialog.type === 'customize' && (
        <ConfigurationDialog
          open={dialog.open}
          onClose={() => {
            setDialog({ type: 'customize', open: false });
            setSelectedTemplate(null);
          }}
          onSave={handleSaveTemplate}
          habits={selectedTemplate.habits}
          activeDays={selectedTemplate.activeDays}
          onUpdateDays={(days) => updateTemplateDays(selectedTemplate.templateId, days)}
        />
      )}
    </div>
  );
};

export default HabitTracker;
