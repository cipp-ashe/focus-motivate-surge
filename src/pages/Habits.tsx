
import React, { useState, useCallback } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import HabitTracker from '@/components/habits/HabitTracker';
import TemplateSelectionSheet from '@/components/habits/TemplateSelectionSheet';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const { open, isOpen } = useHabitsPanel();
  const [configOpen, setConfigOpen] = useState(false);

  // Simplified logic to handle template configuration
  const handleOpenConfig = useCallback(() => {
    console.log("Opening config sheet");
    setConfigOpen(true);
  }, []);

  const handleCloseConfig = useCallback((open: boolean) => {
    console.log("Config sheet state change:", open);
    setConfigOpen(open);
  }, []);

  const handleSelectTemplate = useCallback((templateId: string) => {
    console.log("Template selected:", templateId);
    const template = habitTemplates.find(t => t.id === templateId);
    if (template) {
      toast.success(`Added template: ${template.name}`);
    }
  }, []);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Habit Configuration
      </h1>
      
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => {
            if (!isOpen) {
              open();
            } else {
              handleOpenConfig();
            }
          }}
        >
          <Settings className="h-4 w-4" />
          Configure Templates
        </Button>
      </div>

      <HabitTracker 
        activeTemplates={templates}
        onConfigureTemplates={handleOpenConfig}
      />

      <TemplateSelectionSheet
        isOpen={configOpen}
        onOpenChange={handleCloseConfig}
        allTemplates={habitTemplates}
        activeTemplateIds={templates.map(t => t.templateId)}
        onSelectTemplate={handleSelectTemplate}
        onCreateTemplate={() => {
          toast.info('Creating new template');
        }}
      />
    </div>
  );
};

export default HabitsPage;
