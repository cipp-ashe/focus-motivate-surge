
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TabSection from './ManageTemplatesDialog/TabSection';
import { HabitTemplate, NewTemplate } from './types';

export interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
  onClose: () => void;
  allTemplates?: HabitTemplate[];
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate,
  onClose,
  allTemplates
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        onClose();
      }
    }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Habit Templates</SheetTitle>
          <SheetDescription>
            Choose a template to add to your habits
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <TabSection
            customTemplates={customTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelectTemplate={onSelectTemplate}
            onDeleteCustomTemplate={onDeleteCustomTemplate}
            onCreateTemplate={onCreateTemplate}
            allTemplates={allTemplates}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelectionSheet;
