
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { HabitTemplate, NewTemplate } from '../types';
import AvailableTemplates from './AvailableTemplates';
import CustomTemplates from './CustomTemplates';
import CreateTemplateForm from './CreateTemplateForm';

interface ManageTemplatesDialogProps {
  open: boolean;
  onClose: () => void;
  availableTemplates: HabitTemplate[];
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onCreateTemplate: (template: NewTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

const ManageTemplatesDialog: React.FC<ManageTemplatesDialogProps> = ({
  open,
  onClose,
  availableTemplates,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
  onDeleteTemplate,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateTemplate = (template: NewTemplate) => {
    onCreateTemplate(template);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-md bg-background border shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
          </DialogHeader>
          <CreateTemplateForm
            onSubmit={handleCreateTemplate}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-2xl bg-background border shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Manage Templates</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>

        <Tabs defaultValue="available">
          <TabsList className="w-full">
            <TabsTrigger value="available" className="flex-1">
              Available Templates
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex-1">
              Custom Templates
            </TabsTrigger>
          </TabsList>
          <TabsContent value="available">
            <AvailableTemplates
              templates={availableTemplates}
              activeTemplateIds={activeTemplateIds}
              onSelect={onSelectTemplate}
            />
          </TabsContent>
          <TabsContent value="custom">
            <CustomTemplates
              templates={customTemplates}
              activeTemplateIds={activeTemplateIds}
              onSelect={onSelectTemplate}
              onDelete={onDeleteTemplate}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTemplatesDialog;
