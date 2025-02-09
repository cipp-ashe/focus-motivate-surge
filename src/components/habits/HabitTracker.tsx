
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { ActiveTemplate } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import TemplateManager from './TemplateManager';

const HabitTracker: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

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

  const handleCreateTemplate = () => {
    const newTemplate: ActiveTemplate = {
      templateId: `custom-${Date.now()}`,
      habits: [],
      customized: true,
      activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    };
    setSelectedTemplate(newTemplate);
    setIsCreatingTemplate(true);
  };

  const handleConfigureTemplate = (template: ActiveTemplate) => {
    setSelectedTemplate(template);
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
    setIsCreatingTemplate(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <HabitTrackerHeader onConfigureTemplates={() => setIsConfigOpen(true)} />

      <ActiveTemplateList
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
          <TemplateManager
            availableTemplates={habitTemplates}
            activeTemplateIds={activeTemplates.map(t => t.templateId)}
            onSelectTemplate={handleTemplateSelect}
            onCreateTemplate={handleCreateTemplate}
          />
        </SheetContent>
      </Sheet>

      {selectedTemplate && (
        <Sheet 
          open={!!selectedTemplate} 
          onOpenChange={(open) => {
            if (!open && !isCreatingTemplate) {
              handleCloseTemplate();
            }
          }}
        >
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>
                {selectedTemplate.habits.length === 0 ? 'Create New Template' : 'Edit Template'}
              </SheetTitle>
            </SheetHeader>
            <TemplateManager
              templateToEdit={selectedTemplate}
              onUpdateTemplate={(updates) => {
                if (selectedTemplate.habits.length === 0) {
                  const updatedTemplate = { ...selectedTemplate, ...updates };
                  addTemplate(updatedTemplate);
                } else {
                  updateTemplate(selectedTemplate.templateId, updates);
                }
                handleCloseTemplate();
              }}
              onUpdateDays={(days) => {
                updateTemplateDays(selectedTemplate.templateId, days);
              }}
              onClose={handleCloseTemplate}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default HabitTracker;
