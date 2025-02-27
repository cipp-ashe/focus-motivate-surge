
import React, { useState } from 'react';
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
  const { open } = useHabitsPanel();
  const [configOpen, setConfigOpen] = useState(false);

  // Function to open config sheet directly
  const openConfig = () => {
    console.log("Opening config sheet directly");
    setConfigOpen(true);
  };

  // Handle closing config
  const handleCloseConfig = (open: boolean) => {
    console.log("Config sheet state change:", open);
    setConfigOpen(open);
  };

  // Handle template selection
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
      
      <div className="flex flex-col md:flex-row md:justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={open}
        >
          <Settings className="h-4 w-4" />
          Open Habit Drawer
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={openConfig}
        >
          <Settings className="h-4 w-4" />
          Configure Templates
        </Button>
      </div>

      {/* Habit drawer */}
      <HabitTracker 
        activeTemplates={templates}
      />

      {/* Template configuration (completely separate from drawer) */}
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
