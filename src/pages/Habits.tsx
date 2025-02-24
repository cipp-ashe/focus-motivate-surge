
import React, { useState } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import HabitTracker from '@/components/habits/HabitTracker';
import TemplateSelectionSheet from '@/components/habits/TemplateSelectionSheet';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
        Habit Configuration
      </h1>
      
      <Sheet>
        <div className="flex justify-end mb-4">
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configure Templates
            </Button>
          </SheetTrigger>
        </div>

        <HabitTracker 
          activeTemplates={templates}
          onConfigureTemplates={() => setIsConfigOpen(true)}
        />

        <SheetContent>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HabitsPage;
