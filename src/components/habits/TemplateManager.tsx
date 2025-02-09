
import React, { useEffect, useState, useCallback } from 'react';
import { Plus, GripVertical, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitTemplate, ActiveTemplate, DayOfWeek, DAYS_OF_WEEK } from './types';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import HabitForm from './ConfigurationDialog/HabitForm';
import { createEmptyHabit } from './types';
import { useWindowSize } from '@/hooks/useWindowSize';

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

  // Filter out active templates from available ones
  const inactiveTemplates = availableTemplates.filter(
    template => !activeTemplateIds.includes(template.id)
  );

  if (templateToEdit) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="space-y-4 flex-1 overflow-hidden p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-primary">Active Days</h4>
            <ToggleGroup 
              type="multiple" 
              value={templateToEdit.activeDays}
              onValueChange={(values) => {
                if (values.length > 0) {
                  onUpdateDays?.(values as DayOfWeek[]);
                }
              }}
              className="flex flex-wrap gap-1"
            >
              {DAYS_OF_WEEK.map((day) => (
                <ToggleGroupItem
                  key={day}
                  value={day}
                  aria-label={`Toggle ${day}`}
                  className="flex-1 min-w-[36px] h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {day.charAt(0)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
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
                    <HabitForm
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
                      onDragStart={() => {}}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="p-4 border-t">
          <Button onClick={onSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    );
  }

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
