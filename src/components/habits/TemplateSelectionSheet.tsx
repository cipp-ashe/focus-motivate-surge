
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ActiveTemplate, DayOfWeek, HabitTemplate } from './types';
import { Button } from '../ui/button';
import { Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';
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

  const handleSelectTemplate = (template: HabitTemplate) => {
    const newTemplate: ActiveTemplate = {
      templateId: template.id,
      habits: template.defaultHabits,
      activeDays: template.defaultDays || [],
      customized: false
    };
    setConfiguringTemplate(newTemplate);
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
    setConfiguringTemplate(null);
    onOpenChange(false);
    toast.success('Template configured successfully');
  };

  return (
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

      {configuringTemplate && (
        <ConfigurationDialog
          open={!!configuringTemplate}
          onClose={() => setConfiguringTemplate(null)}
          habits={configuringTemplate.habits}
          activeDays={configuringTemplate.activeDays}
          onUpdateDays={handleUpdateDays}
          onSave={handleSaveConfiguration}
          onSaveAsTemplate={() => {}}
        />
      )}
    </Sheet>
  );
};

export default TemplateSelectionSheet;
