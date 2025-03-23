
import React from 'react';
import {
  SheetContent as ShadcnSheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TabSection from '../ManageTemplatesDialog/TabSection';
import { HabitTemplate, NewTemplate } from '../types';

interface SheetContentProps {
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
  onClose: () => void;
}

const SheetContent: React.FC<SheetContentProps> = ({
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onDeleteCustomTemplate,
  onCreateTemplate,
  onClose
}) => {
  return (
    <ShadcnSheetContent className="w-full sm:max-w-md overflow-y-auto">
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
    </ShadcnSheetContent>
  );
};

export default SheetContent;
