
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import SheetTabContent from './SheetContent';
import { HabitTemplate } from '../types';

export interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onCreateTemplate: () => void;
  onClose: () => void;
  customTemplates: HabitTemplate[];
  onDeleteCustomTemplate: (templateId: string) => void;
  allTemplates: HabitTemplate[];
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
  onClose,
  customTemplates,
  onDeleteCustomTemplate,
  allTemplates
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span style={{ display: 'none' }}>Open Template Selection</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[540px] p-0 bg-background">
        <SheetTabContent 
          activeTemplateIds={activeTemplateIds}
          onSelectTemplate={onSelectTemplate}
          onCreateTemplate={onCreateTemplate}
          onClose={onClose}
          customTemplates={customTemplates}
          onDeleteCustomTemplate={onDeleteCustomTemplate}
          allTemplates={allTemplates}
        />
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelectionSheet;
