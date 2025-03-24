
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TemplateSelectionSheet } from './TemplateSelectionSheet';
import { ActiveTemplate } from '@/types/habit';
import { ActiveTemplateList } from './ActiveTemplateList';

interface HabitTemplateManagerProps {
  activeTemplates: ActiveTemplate[];
  addTemplate: (templateId: string) => void;
  removeTemplate: (templateId: string) => void;
  configureTemplate: (template: any) => void;
}

export const HabitTemplateManager: React.FC<HabitTemplateManagerProps> = ({
  activeTemplates,
  addTemplate,
  removeTemplate,
  configureTemplate
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Templates</h2>
        <Button
          onClick={() => setIsSheetOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Template</span>
        </Button>
      </div>
      
      {activeTemplates.length === 0 ? (
        <div className="bg-muted/40 rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">No active templates</p>
          <Button
            onClick={() => setIsSheetOpen(true)}
            variant="outline"
            size="sm"
          >
            Add your first template
          </Button>
        </div>
      ) : (
        <ActiveTemplateList 
          templates={activeTemplates}
          onRemoveTemplate={removeTemplate}
          onConfigureTemplate={configureTemplate}
        />
      )}
      
      <TemplateSelectionSheet 
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSelect={addTemplate}
      />
    </div>
  );
};
