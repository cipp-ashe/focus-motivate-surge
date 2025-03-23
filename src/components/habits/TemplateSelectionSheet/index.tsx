
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ActiveTemplate, HabitTemplate } from '../types';
import SheetContentComponent from './SheetContent';
import ConfigComponent from './ConfigComponent';
import { useTemplateLoader } from './useTemplateLoader';

interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onCreateTemplate: () => void;
  customTemplates: HabitTemplate[];
  onDeleteCustomTemplate: (templateId: string) => void;
  onClose: () => void;
}

const TemplateSelectionSheet: React.FC<TemplateSelectionSheetProps> = ({
  isOpen,
  onOpenChange,
  allTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
  customTemplates: propCustomTemplates,
  onDeleteCustomTemplate,
  onClose,
}) => {
  const [configuringTemplate, setConfiguringTemplate] = useState<ActiveTemplate | null>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const { customTemplates, setCustomTemplates } = useTemplateLoader(isOpen);
  
  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setConfigDialogOpen(false);
      setConfiguringTemplate(null);
      if (onClose) onClose();
    }
  }, [isOpen, onClose]);

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
    setConfiguringTemplate(null);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="p-0">
          <SheetContentComponent
            allTemplates={allTemplates}
            customTemplates={propCustomTemplates || customTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelectTemplate={onSelectTemplate}
            onCreateTemplate={onCreateTemplate}
            onOpenChange={onOpenChange}
            setConfiguringTemplate={setConfiguringTemplate}
            setConfigDialogOpen={setConfigDialogOpen}
            onDeleteCustomTemplate={onDeleteCustomTemplate}
          />
        </SheetContent>
      </Sheet>

      <ConfigComponent
        configuringTemplate={configuringTemplate}
        configDialogOpen={configDialogOpen}
        onClose={handleCloseConfigDialog}
        onSelectTemplate={onSelectTemplate}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

export default TemplateSelectionSheet;
