
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
import { ActiveTemplate, DayOfWeek, HabitTemplate } from './types';
import ConfigurationDialog from './ConfigurationDialog';

interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (templateId: string) => void;
  onCreateTemplate: () => void;
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  allTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
}) => {
  const [configuringTemplate, setConfiguringTemplate] = useState<ActiveTemplate | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  const handleSelectTemplate = (template: HabitTemplate) => {
    console.log("Selected template for configuration:", template.name);
    const newTemplate: ActiveTemplate = {
      templateId: template.id,
      habits: template.defaultHabits,
      activeDays: template.defaultDays || [],
      customized: false
    };
    setConfiguringTemplate(newTemplate);
    setConfigDialogOpen(true);
  };

  const handleUpdateDays = (days: DayOfWeek[]) => {
    if (!configuringTemplate) return;
    const updatedTemplate = {
      ...configuringTemplate,
      activeDays: days,
      customized: true
    };
    setConfiguringTemplate(updatedTemplate);
  };

  const handleSaveConfiguration = () => {
    if (!configuringTemplate) return;
    eventBus.emit('habit:template-update', configuringTemplate);
    onSelectTemplate(configuringTemplate.templateId);
    handleCloseConfigDialog();
    onOpenChange(false);
    toast.success('Template configured successfully');
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
    setConfiguringTemplate(null);
  };

  console.log("TemplateSelectionSheet - configDialogOpen:", configDialogOpen);
  console.log("TemplateSelectionSheet - configuringTemplate:", configuringTemplate?.templateId);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 pb-0">
              <SheetHeader>
                <SheetTitle>Configure Templates</SheetTitle>
              </SheetHeader>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-4">
                {allTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                    <Button
                      onClick={() => handleSelectTemplate(template)}
                      disabled={activeTemplateIds.includes(template.id)}
                    >
                      {activeTemplateIds.includes(template.id) ? 'Added' : 'Configure'}
                    </Button>
                  </div>
                ))}
                <Button 
                  onClick={onCreateTemplate}
                  className="w-full"
                  variant="outline"
                >
                  Create New Template
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {configuringTemplate && (
        <ConfigurationDialog
          open={configDialogOpen}
          onClose={handleCloseConfigDialog}
          habits={configuringTemplate.habits}
          activeDays={configuringTemplate.activeDays}
          onUpdateDays={handleUpdateDays}
          onSave={handleSaveConfiguration}
          onSaveAsTemplate={() => {
            toast.info("Save as template feature coming soon");
          }}
        />
      )}
    </>
  );
};

export default TemplateSelectionSheet;
