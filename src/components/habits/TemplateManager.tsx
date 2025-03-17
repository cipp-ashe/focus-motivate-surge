
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import ConfigurationDialog from '../habits/ConfigurationDialog';
import { ActiveTemplate, DayOfWeek, HabitDetail } from './types';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';

interface TemplateManagerProps {
  templateToEdit: ActiveTemplate;
  onUpdateTemplate: (updates: Partial<ActiveTemplate>) => void;
  onUpdateDays: (days: DayOfWeek[]) => void;
  onClose: () => void;
  onSave: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  templateToEdit,
  onUpdateTemplate,
  onUpdateDays,
  onClose,
  onSave,
}) => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ActiveTemplate>(templateToEdit);

  // Sync with parent template changes, but preserve local changes if we're configuring
  useEffect(() => {
    if (!isConfiguring) {
      setCurrentTemplate(templateToEdit);
    }
  }, [templateToEdit, isConfiguring]);

  const updateTemplateAndEmit = (updates: Partial<ActiveTemplate>) => {
    const updatedTemplate = {
      ...currentTemplate,
      ...updates,
      customized: true
    };
    
    setCurrentTemplate(updatedTemplate);
    eventManager.emit('habit:template-update', updatedTemplate);
    return updatedTemplate;
  };

  const handleUpdateDays = (days: DayOfWeek[]) => {
    console.log('Updating days:', days);
    const updated = updateTemplateAndEmit({ activeDays: days });
    onUpdateDays(days);
  };

  const handleUpdateHabits = (habits: HabitDetail[]) => {
    const updated = updateTemplateAndEmit({ habits });
    onUpdateTemplate({ habits });
  };

  const handleSaveTemplate = () => {
    if (!currentTemplate.habits?.length) {
      toast.error('Please add at least one habit to the template');
      return;
    }
    onSave();
  };

  const handleOpenConfiguration = () => {
    setIsConfiguring(true);
  };

  const handleCloseConfiguration = () => {
    setIsConfiguring(false);
    // When closing, ensure parent state is updated with our final state
    onUpdateTemplate(currentTemplate);
  };

  // Fix for the type error - wrap the handler to match expected signature
  const handleSaveConfiguration = () => {
    // Call our internal handler which actually processes the habits
    handleUpdateHabits(currentTemplate.habits);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenConfiguration}
          className="ml-auto"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfigurationDialog
        open={isConfiguring}
        onClose={handleCloseConfiguration}
        habits={currentTemplate.habits}
        activeDays={currentTemplate.activeDays}
        onUpdateDays={handleUpdateDays}
        onSave={handleSaveConfiguration}
        onSaveAsTemplate={handleSaveTemplate}
      />
    </div>
  );
};

export default TemplateManager;
