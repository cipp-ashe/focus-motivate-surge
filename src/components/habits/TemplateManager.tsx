
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import ConfigurationDialog from '../habits/ConfigurationDialog';
import { ActiveTemplate, DayOfWeek, HabitDetail } from './types';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';

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

  // Sync with parent template changes
  useEffect(() => {
    setCurrentTemplate(templateToEdit);
  }, [templateToEdit]);

  const handleUpdateDays = (days: DayOfWeek[]) => {
    console.log('Updating days:', days);
    
    // Update local state
    setCurrentTemplate(prev => ({
      ...prev,
      activeDays: days,
      customized: true
    }));
    
    // Emit template update event
    eventBus.emit('habit:template-update', {
      ...currentTemplate,
      activeDays: days,
      customized: true
    });
    
    // Update parent state
    onUpdateDays(days);
  };

  const handleUpdateHabits = (habits: HabitDetail[]) => {
    // Update local state
    setCurrentTemplate(prev => ({
      ...prev,
      habits,
      customized: true
    }));
    
    // Emit template update event
    eventBus.emit('habit:template-update', {
      ...currentTemplate,
      habits,
      customized: true
    });
    
    // Update parent state
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
        onSave={handleUpdateHabits}
        onSaveAsTemplate={handleSaveTemplate}
      />
    </div>
  );
};

export default TemplateManager;
