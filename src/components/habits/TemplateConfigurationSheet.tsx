
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActiveTemplate, DayOfWeek } from './types';
import TemplateManager from './TemplateManager';

interface TemplateConfigurationSheetProps {
  selectedTemplate: ActiveTemplate | null;
  isCreatingTemplate: boolean;
  newTemplateName: string;
  onNewTemplateNameChange: (value: string) => void;
  onClose: () => void;
  onUpdateTemplate: (updates: Partial<ActiveTemplate>) => void;
  onUpdateDays: (templateId: string, days: DayOfWeek[]) => void;
  onSave: () => void;
}

const TemplateConfigurationSheet: React.FC<TemplateConfigurationSheetProps> = ({
  selectedTemplate,
  isCreatingTemplate,
  newTemplateName,
  onNewTemplateNameChange,
  onClose,
  onUpdateTemplate,
  onUpdateDays,
  onSave,
}) => {
  if (!selectedTemplate) return null;

  return (
    <Sheet 
      open={!!selectedTemplate} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 pb-0">
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
                  onChange={(e) => onNewTemplateNameChange(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden">
            <TemplateManager
              templateToEdit={selectedTemplate}
              onUpdateTemplate={onUpdateTemplate}
              onUpdateDays={(days) => onUpdateDays(selectedTemplate.templateId, days)}
              onClose={onClose}
              onSave={onSave}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateConfigurationSheet;

