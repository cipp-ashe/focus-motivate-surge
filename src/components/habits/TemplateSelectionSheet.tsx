
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
  onClose: () => void;
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onClose,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate,
  onOpenChange
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (onOpenChange) {
        onOpenChange(open);
      }
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
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelectionSheet;
