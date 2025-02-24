
import React, { useState } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import HabitTracker from '@/components/habits/HabitTracker';
import TemplateSelectionSheet from '@/components/habits/TemplateSelectionSheet';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Habit Configuration
      </h1>
      
      <HabitTracker 
        activeTemplates={templates} 
        onConfigureTemplates={() => {
          setIsConfigOpen(true);
          console.log('Opening template configuration');
        }} 
      />

      <TemplateSelectionSheet
        isOpen={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        allTemplates={habitTemplates}
        activeTemplateIds={templates.map(t => t.templateId)}
        onSelectTemplate={(templateId) => {
          const template = habitTemplates.find(t => t.id === templateId);
          if (template) {
            toast.success(`Added template: ${template.name}`);
          }
        }}
        onCreateTemplate={() => {
          toast.info('Creating new template');
        }}
      />
    </div>
  );
};

export default HabitsPage;
