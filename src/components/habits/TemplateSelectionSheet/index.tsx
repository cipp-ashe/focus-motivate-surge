
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
  const { customTemplates, setCustomTemplates } = useTemplateLoader(isOpen);
  
  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setConfigDialogOpen(false);
      setConfiguringTemplate(null);
    }
  }, [isOpen]);

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
            customTemplates={customTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelectTemplate={onSelectTemplate}
            onCreateTemplate={onCreateTemplate}
            onOpenChange={onOpenChange}
            setConfiguringTemplate={setConfiguringTemplate}
            setConfigDialogOpen={setConfigDialogOpen}
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
