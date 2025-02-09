
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HabitTemplate } from '../types';
import AvailableTemplates from './AvailableTemplates';

interface ManageTemplatesDialogProps {
  open: boolean;
  onClose: () => void;
  availableTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
}

const ManageTemplatesDialog: React.FC<ManageTemplatesDialogProps> = ({
  open,
  onClose,
  availableTemplates,
  activeTemplateIds,
  onSelectTemplate,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Template</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AvailableTemplates
            templates={availableTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelect={onSelectTemplate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTemplatesDialog;
