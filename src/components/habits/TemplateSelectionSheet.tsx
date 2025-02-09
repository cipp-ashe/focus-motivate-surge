
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { HabitTemplate } from './types';
import TemplateManager from './TemplateManager';

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
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 pb-0">
            <SheetHeader>
              <SheetTitle>Configure Templates</SheetTitle>
            </SheetHeader>
          </div>
          <div className="flex-1 overflow-hidden">
            <TemplateManager
              availableTemplates={allTemplates}
              activeTemplateIds={activeTemplateIds}
              onSelectTemplate={onSelectTemplate}
              onCreateTemplate={onCreateTemplate}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelectionSheet;

