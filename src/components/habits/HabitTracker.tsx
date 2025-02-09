
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { habitTemplates } from '../../utils/habitTemplates';
import { DialogState, DayOfWeek, ActiveTemplate, HabitTemplate, NewTemplate, HabitDetail } from './types';
import { useTemplateManagement } from './hooks/useTemplateManagement';
import { useHabitProgress } from './hooks/useHabitProgress';
import TemplateCard from './TemplateCard';
import ConfigurationDialog from './ConfigurationDialog';
import ManageTemplatesDialog from './ManageTemplatesDialog';

const HabitTracker: React.FC = () => {
  const {
    activeTemplates,
    customTemplates,
    addTemplate,
    updateTemplate,
    removeTemplate,
    saveCustomTemplate,
    updateTemplateOrder,
    updateTemplateDays,
  } = useTemplateManagement();

  const {
    getTodayProgress,
    updateProgress,
  } = useHabitProgress();

  const [selectedTemplate, setSelectedTemplate] = useState<ActiveTemplate | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ type: 'template', open: false });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTemplates = [...activeTemplates];
    const [draggedTemplate] = newTemplates.splice(draggedIndex, 1);
    newTemplates.splice(index, 0, draggedTemplate);
    updateTemplateOrder(newTemplates);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCustomizeTemplate = (template: ActiveTemplate) => {
    setSelectedTemplate({
      ...template,
      activeDays: template.activeDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    });
    setDialog({ type: 'customize', open: true });
  };

  const createActiveTemplate = (template: HabitTemplate): ActiveTemplate => ({
    templateId: template.id,
    habits: template.defaultHabits,
    customized: false,
    activeDays: template.defaultDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Habit Tracker</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ type: 'manage', open: true })}
          sx={{ borderRadius: 8 }}
        >
          Manage Templates
        </Button>
      </Box>

      <Stack spacing={2}>
        {activeTemplates.map((template, index) => {
          const templateInfo = habitTemplates.find(t => t.id === template.templateId);
          if (!templateInfo) return null;

          return (
            <Box
              key={template.templateId}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              sx={{
                cursor: 'grab',
                transform: draggedIndex === index ? 'scale(1.02)' : 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                zIndex: draggedIndex === index ? 1 : 'auto',
                opacity: draggedIndex === index ? 0.8 : 1,
                boxShadow: draggedIndex === index ? 3 : 0,
                '&:hover': {
                  boxShadow: 1,
                },
                '&:active': { cursor: 'grabbing' },
              }}
            >
              <TemplateCard
                template={template}
                templateInfo={templateInfo}
                onCustomize={() => handleCustomizeTemplate(template)}
                onRemove={() => removeTemplate(template.templateId)}
                getProgress={(habitId) => getTodayProgress(habitId, template.templateId)}
                onHabitUpdate={(habitId, value) => updateProgress(habitId, template.templateId, value)}
              />
            </Box>
          );
        })}
      </Stack>

      <ManageTemplatesDialog
        open={dialog.type === 'manage' && dialog.open}
        onClose={() => setDialog({ type: 'manage', open: false })}
        availableTemplates={habitTemplates}
        customTemplates={customTemplates}
        activeTemplateIds={activeTemplates.map(t => t.templateId)}
        onSelectTemplate={(template) => {
          addTemplate(createActiveTemplate(template));
          setDialog({ type: 'manage', open: false });
        }}
        onCreateTemplate={(template) => {
          const newTemplate = saveCustomTemplate(template);
          addTemplate(createActiveTemplate(newTemplate));
          setDialog({ type: 'manage', open: false });
        }}
      />

      {selectedTemplate && (
        <ConfigurationDialog
          open={dialog.type === 'customize' && dialog.open}
          onClose={() => {
            setDialog({ type: 'customize', open: false });
            setSelectedTemplate(null);
          }}
          onSave={(habits: HabitDetail[]) => {
            updateTemplate(selectedTemplate.templateId, { habits });
            setDialog({ type: 'customize', open: false });
            setSelectedTemplate(null);
          }}
          onSaveAsTemplate={() => {
            if (selectedTemplate) {
              const baseTemplate = habitTemplates.find(t => t.id === selectedTemplate.templateId);
              if (baseTemplate) {
                const newTemplate = saveCustomTemplate({
                  name: `${baseTemplate.name} (Modified)`,
                  description: baseTemplate.description,
                  category: baseTemplate.category,
                  defaultHabits: selectedTemplate.habits,
                  defaultDays: selectedTemplate.activeDays,
                });
                removeTemplate(selectedTemplate.templateId);
                addTemplate(createActiveTemplate(newTemplate));
                setDialog({ type: 'customize', open: false });
                setSelectedTemplate(null);
              }
            }
          }}
          habits={selectedTemplate.habits}
          activeDays={selectedTemplate.activeDays}
          onUpdateDays={(days: DayOfWeek[]) => updateTemplateDays(selectedTemplate.templateId, days)}
        />
      )}
    </Box>
  );
};

export default HabitTracker;

