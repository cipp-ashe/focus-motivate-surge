
import React from 'react';
import { toast } from 'sonner';
import { ActiveTemplate } from '@/types/habit';
import ConfigurationDialog from '../ConfigurationDialog';

interface ConfigComponentProps {
  configuringTemplate: ActiveTemplate | null;
  configDialogOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenChange: (open: boolean) => void;
}

const ConfigComponent: React.FC<ConfigComponentProps> = ({
  configuringTemplate,
  configDialogOpen,
  onClose,
  onSelectTemplate,
  onOpenChange,
}) => {
  if (!configuringTemplate) {
    return null;
  }

  return (
    <ConfigurationDialog
      open={configDialogOpen}
      onClose={onClose}
      habits={configuringTemplate.habits}
      activeDays={configuringTemplate.activeDays}
      onUpdateDays={(days) => {
        if (!configuringTemplate) return;
        // Note: This is a placeholder as the full functionality is in the parent component
        // The parent will need to handle the update of the template
      }}
      onSave={() => {
        if (!configuringTemplate) return;
        onSelectTemplate(configuringTemplate.templateId);
        onClose();
        onOpenChange(false);
        toast.success('Template configured successfully');
      }}
      onSaveAsTemplate={() => {
        toast.info("Save as template feature coming soon");
      }}
    />
  );
};

export default ConfigComponent;
