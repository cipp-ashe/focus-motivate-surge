
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitTemplate, ActiveTemplate, DayOfWeek } from './types';
import { createEmptyHabit } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';
import DaySelector from './ConfigurationDialog/DaySelector';
import HabitFormField from './HabitFormField';
import { toast } from 'sonner';

interface TemplateManagerProps {
  availableTemplates?: HabitTemplate[];
  activeTemplateIds?: string[];
  onSelectTemplate?: (templateId: string) => void;
  templateToEdit?: ActiveTemplate;
  onUpdateTemplate?: (updates: Partial<ActiveTemplate>) => void;
  onUpdateDays?: (days: DayOfWeek[]) => void;
  onClose?: () => void;
  onCreateTemplate?: () => void;
  onSave?: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  availableTemplates = [],
  activeTemplateIds = [],
  onSelectTemplate,
  templateToEdit,
  onUpdateTemplate,
  onUpdateDays,
  onClose,
  onCreateTemplate,
  onSave,
}) => {
  const { height } = useWindowSize();
  const [containerHeight, setContainerHeight] = useState('600px');

  const updateContainerHeight = useCallback(() => {
    if (height) {
      const newHeight = Math.max(400, Math.min(height - 200, 800));
      requestAnimationFrame(() => {
        setContainerHeight(`${newHeight}px`);
      });
    }
  }, [height]);

  useEffect(() => {
    updateContainerHeight();
    const debounceResize = setTimeout(updateContainerHeight, 100);
    return () => clearTimeout(debounceResize);
  }, [updateContainerHeight]);

  const handleSave = () => {
    if (!templateToEdit?.habits?.length) {
      toast.error('Please add at least one habit to the template');
      return;
    }
    onSave?.();
  };

  if (templateToEdit) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="space-y-4 flex-1 overflow-hidden p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Active Days</h4>
            <DaySelector 
              activeDays={templateToEdit.activeDays}
              onUpdateDays={onUpdateDays || (() => {})}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-primary">Habits</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newHabit = createEmptyHabit();
                  onUpdateTemplate?.({
                    habits: [...(templateToEdit.habits || []), newHabit]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2 pr-4">
                {(templateToEdit.habits || []).map((habit, index) => (
                  <div
                    key={habit.id}
                    className="transition-all hover:scale-[1.01]"
                  >
                    <HabitFormField
                      habit={habit}
                      onUpdate={(updates) => {
                        const updatedHabits = [...(templateToEdit.habits || [])];
                        updatedHabits[index] = { ...habit, ...updates };
                        onUpdateTemplate?.({ habits: updatedHabits });
                      }}
                      onDelete={() => {
                        const updatedHabits = (templateToEdit.habits || []).filter((_, i) => i !== index);
                        onUpdateTemplate?.({ habits: updatedHabits });
                      }}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="p-4 border-t">
          <Button onClick={handleSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    );
  }

  // Filter out active templates from available ones
  const inactiveTemplates = availableTemplates.filter(
    template => !activeTemplateIds.includes(template.id)
  );

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          <Button 
            onClick={onCreateTemplate}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
          
          {inactiveTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    {template.defaultHabits.length} habits
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectTemplate?.(template.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Template
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplateManager;
