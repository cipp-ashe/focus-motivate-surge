
import React, { useState, useEffect } from 'react';
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
  const { isConfiguring, stopConfiguring, startConfiguring } = useHabitsPanel();
  const [displayConfig, setDisplayConfig] = useState(false);

  // Debug when this component renders
  useEffect(() => {
    console.log("HabitsPage rendered, isConfiguring:", isConfiguring);
  }, [isConfiguring]);

  // This effect handles the display timing to prevent flashing
  useEffect(() => {
    if (isConfiguring) {
      setDisplayConfig(true);
    } else {
      // Add a delay before hiding to allow for animations
      const timer = setTimeout(() => {
        setDisplayConfig(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isConfiguring]);

  const handleOpenConfig = () => {
    console.log("Opening config sheet from page button");
    startConfiguring();
  };

  const handleCloseConfig = () => {
    console.log("Closing config sheet");
    stopConfiguring();
  };

  const handleSelectTemplate = (templateId: string) => {
    console.log("Template selected:", templateId);
    const template = habitTemplates.find(t => t.id === templateId);
    if (template) {
      toast.success(`Added template: ${template.name}`);
    }
  };

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
          onClick={handleOpenConfig}
        >
          <Settings className="h-4 w-4" />
          Configure Templates
        </Button>
      </div>

      <HabitTracker 
        activeTemplates={templates}
        onConfigureTemplates={handleOpenConfig}
      />

      {displayConfig && (
        <TemplateSelectionSheet
          isOpen={isConfiguring}
          onOpenChange={(open) => {
            if (!open) handleCloseConfig();
          }}
          allTemplates={habitTemplates}
          activeTemplateIds={templates.map(t => t.templateId)}
          onSelectTemplate={handleSelectTemplate}
          onCreateTemplate={() => {
            toast.info('Creating new template');
          }}
        />
      )}
    </div>
  );
};

export default HabitsPage;
