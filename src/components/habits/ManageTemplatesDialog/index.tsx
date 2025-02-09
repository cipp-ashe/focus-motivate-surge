import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { HabitTemplate, NewTemplate } from '../../types';
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
}

const ManageTemplatesDialog: React.FC<ManageTemplatesDialogProps> = ({
  open,
  onClose,
  availableTemplates,
  customTemplates,
  activeTemplateIds,
  onSelectTemplate,
  onCreateTemplate,
}) => {
  const [tab, setTab] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleCreateTemplate = (template: NewTemplate) => {
    onCreateTemplate(template);
    setShowCreateForm(false);
  };

  if (showCreateForm) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Template</DialogTitle>
        <DialogContent>
          <CreateTemplateForm
            onSubmit={handleCreateTemplate}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Manage Templates</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateForm(true)}
          >
            Create Template
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Available Templates" />
            <Tab label="Custom Templates" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <AvailableTemplates
            templates={availableTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelect={onSelectTemplate}
          />
        )}
        {tab === 1 && (
          <CustomTemplates
            templates={customTemplates}
            activeTemplateIds={activeTemplateIds}
            onSelect={onSelectTemplate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageTemplatesDialog;
