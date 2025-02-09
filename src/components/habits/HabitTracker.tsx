
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { ActiveTemplate } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import TemplateList from './TemplateList';
import TemplateConfiguration from './TemplateConfiguration';

const HabitTracker: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);

  const {
    activeTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    updateTemplateDays,
  } = useTemplateManagement();

  const {
    getTodayProgress,
    updateProgress,
  } = useHabitProgress();

  const handleTemplateSelect = (templateId: string) => {
    const template = habitTemplates.find(t => t.id === templateId);
    if (template) {
      addTemplate(template);
      setIsConfigOpen(false);
    }
  };

  const handleConfigureTemplate = (template: ActiveTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <HabitTrackerHeader onConfigureTemplates={() => setIsConfigOpen(true)} />
      
      <TemplateList
        activeTemplates={activeTemplates}
        onConfigure={handleConfigureTemplate}
        onRemove={removeTemplate}
        getTodayProgress={getTodayProgress}
        onHabitUpdate={updateProgress}
      />

      <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Configure Templates</SheetTitle>
          </SheetHeader>
          <TemplateConfiguration
            availableTemplates={habitTemplates}
            activeTemplateIds={activeTemplates.map(t => t.templateId)}
            onSelectTemplate={handleTemplateSelect}
          />
        </SheetContent>
      </Sheet>

      {selectedTemplate && (
        <TemplateConfiguration
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onUpdate={(updates) => {
            updateTemplate(selectedTemplate.templateId, updates);
            setSelectedTemplate(null);
          }}
          onUpdateDays={(days) => {
            updateTemplateDays(selectedTemplate.templateId, days);
          }}
        />
      )}
    </div>
  );
};

export default HabitTracker;
