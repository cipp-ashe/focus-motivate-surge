import React, { useState } from 'react';
import { toast } from 'sonner';
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
    customTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    saveCustomTemplate,
    deleteCustomTemplate,
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
      toast.success('Template updated successfully');
      setDialog({ type: 'customize', open: false });
      setSelectedTemplate(null);
    }
  };

  const handleSaveAsTemplate = () => {
    if (selectedTemplate) {
      const baseTemplate = habitTemplates.find(t => t.id === selectedTemplate.templateId);
      if (baseTemplate) {
        const newTemplate = saveCustomTemplate({
          name: `${baseTemplate.name} (Modified)`,
          description: baseTemplate.description,
          category: baseTemplate.category,
          defaultHabits: selectedTemplate.habits,
          defaultDays: selectedTemplate.activeDays,
        });
        removeTemplate(selectedTemplate.templateId);
        addTemplate(createActiveTemplate(newTemplate));
        toast.success('Template saved as custom template');
        setDialog({ type: 'customize', open: false });
        setSelectedTemplate(null);
      }
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

  const handleDeleteCustomTemplate = (templateId: string) => {
    deleteCustomTemplate(templateId);
    toast.success('Template deleted successfully');
  };

  const createActiveTemplate = (template: any): ActiveTemplate => ({
    templateId: template.id,
    habits: template.defaultHabits,
    customized: false,
    activeDays: template.defaultDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });

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
          customTemplates={customTemplates}
          activeTemplateIds={activeTemplates.map(t => t.templateId)}
          onSelectTemplate={(template) => {
            addTemplate(template);
            setDialog({ type: 'manage', open: false });
          }}
          onCreateTemplate={(template) => {
            saveCustomTemplate(template);
            setDialog({ type: 'manage', open: false });
          }}
          onDeleteTemplate={handleDeleteCustomTemplate}
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
          onSaveAsTemplate={handleSaveAsTemplate}
          habits={selectedTemplate.habits}
          activeDays={selectedTemplate.activeDays}
          onUpdateDays={(days) => updateTemplateDays(selectedTemplate.templateId, days)}
        />
      )}
    </div>
  );
};

export default HabitTracker;
