import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import TemplateCard from './TemplateCard';
import ConfigurationDialog from './ConfigurationDialog';
import ManageTemplatesDialog from './ManageTemplatesDialog';
import { DialogState, DayOfWeek, ActiveTemplate } from './types';
import HabitInsights from './HabitInsights';
import { Card } from '@/components/ui/card';

const HabitTracker: React.FC = () => {
  const {
    activeTemplates,
    customTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    saveCustomTemplate,
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  const [insightTemplateId, setInsightTemplateId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTemplates = [...activeTemplates];
    const [draggedTemplate] = newTemplates.splice(draggedIndex, 1);
    newTemplates.splice(index, 0, draggedTemplate);
    updateTemplateOrder(newTemplates);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

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

  const createActiveTemplate = (template: any): ActiveTemplate => ({
    templateId: template.id,
    habits: template.defaultHabits,
    customized: false,
    activeDays: template.defaultDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Habit Configuration</h2>
        <Button
          onClick={() => setDialog({ type: 'manage', open: true })}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Template
        </Button>
      </div>

      <div className="space-y-2">
        {activeTemplates.map((template, index) => {
          const templateInfo = habitTemplates.find(t => t.id === template.templateId);
          if (!templateInfo) return null;

          return (
            <div
              key={template.templateId}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              <TemplateCard
                template={template}
                templateInfo={templateInfo}
                onCustomize={() => handleCustomizeTemplate(template)}
                onRemove={() => removeTemplate(template.templateId)}
                onToggleInsights={() => {
                  if (insightTemplateId === template.templateId) {
                    setShowInsights(false);
                    setInsightTemplateId(null);
                  } else {
                    setShowInsights(true);
                    setInsightTemplateId(template.templateId);
                  }
                }}
                getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
                onHabitUpdate={(habitId, value) => updateProgress(habitId, template.templateId, value)}
              />

              {showInsights && insightTemplateId === template.templateId && (
                <div className="mt-2">
                  <HabitInsights
                    habit={template.habits[0]}
                    progress={template.habits.map(habit => getWeeklyProgress(habit.id, template.templateId)).flat()}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ManageTemplatesDialog
        open={dialog.type === 'manage' && dialog.open}
        onClose={() => setDialog({ type: 'manage', open: false })}
        availableTemplates={habitTemplates}
        customTemplates={customTemplates}
        activeTemplateIds={activeTemplates.map(t => t.templateId)}
        onSelectTemplate={(template) => {
          addTemplate(createActiveTemplate(template));
          toast.success('Template added successfully');
          setDialog({ type: 'manage', open: false });
        }}
        onCreateTemplate={(template) => {
          const newTemplate = saveCustomTemplate(template);
          addTemplate(createActiveTemplate(newTemplate));
          toast.success('Custom template created successfully');
          setDialog({ type: 'manage', open: false });
        }}
      />

      {selectedTemplate && (
        <ConfigurationDialog
          open={dialog.type === 'customize' && dialog.open}
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
