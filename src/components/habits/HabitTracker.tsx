
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { habitTemplates } from '../../utils/habitTemplates';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import { ActiveTemplate, DayOfWeek } from './types';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import TemplateManager from './TemplateManager';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const HabitTracker: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

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
    setNewTemplateName('');
  };

  const handleConfigureTemplate = (template: ActiveTemplate) => {
    setSelectedTemplate(template);
    setIsCreatingTemplate(false);
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
    setIsCreatingTemplate(false);
    setNewTemplateName('');
  };

  const handleUpdateTemplate = (updates: Partial<ActiveTemplate>) => {
    if (!selectedTemplate) return;
    const updatedTemplate = { ...selectedTemplate, ...updates };
    setSelectedTemplate(updatedTemplate);
    console.log('Template updated:', updatedTemplate);
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplate) return;
    
    if (!newTemplateName.trim() && isCreatingTemplate) {
      toast.error('Please enter a template name');
      return;
    }

    if (!selectedTemplate.habits?.length) {
      toast.error('Please add at least one habit');
      return;
    }

    if (isCreatingTemplate) {
      const updatedTemplate = { 
        ...selectedTemplate,
        name: newTemplateName 
      };
      addTemplate(updatedTemplate);
      toast.success('Template saved successfully');
      handleCloseTemplate();
    } else {
      updateTemplate(selectedTemplate.templateId, selectedTemplate);
      toast.success('Template updated successfully');
      handleCloseTemplate();
    }
  };

  const handleUpdateDays = (days: DayOfWeek[]) => {
    if (!selectedTemplate) return;
    handleUpdateTemplate({ activeDays: days });
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
            if (!open) handleCloseTemplate();
          }}
        >
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <div className="flex flex-col h-full">
              <SheetHeader>
                <SheetTitle>
                  {isCreatingTemplate ? 'Create New Template' : 'Edit Template'}
                </SheetTitle>
              </SheetHeader>
              
              {isCreatingTemplate && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <TemplateManager
                  templateToEdit={selectedTemplate}
                  onUpdateTemplate={handleUpdateTemplate}
                  onUpdateDays={handleUpdateDays}
                  onClose={handleCloseTemplate}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseTemplate}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default HabitTracker;
