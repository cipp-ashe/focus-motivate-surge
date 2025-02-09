
import React from 'react';
import { Plus, GripVertical, Save } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitTemplate, ActiveTemplate, DayOfWeek, DAYS_OF_WEEK } from './types';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import HabitForm from './ConfigurationDialog/HabitForm';
import { createEmptyHabit } from './types';

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
  if (templateToEdit) {
    return (
      <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] overflow-hidden">
        <div className="space-y-4 flex-1 overflow-hidden p-6">
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
              className="flex flex-wrap gap-2"
            >
              {DAYS_OF_WEEK.map((day) => (
                <ToggleGroupItem
                  key={day}
                  value={day}
                  aria-label={`Toggle ${day}`}
                  className="flex-1 min-w-[40px] data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {day.charAt(0)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-4">
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
                className="hover:bg-primary/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-24rem)]">
              <div className="space-y-3 pr-4">
                {(templateToEdit.habits || []).map((habit, index) => (
                  <div
                    key={habit.id}
                    className="group relative transition-all hover:scale-[1.01]"
                  >
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
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

        <div className="p-6 border-t bg-card">
          <Button onClick={onSave} className="w-full" size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-4 p-6">
        <Button 
          onClick={onCreateTemplate}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
          Create New Template
        </Button>
        {availableTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    {template.defaultHabits.length} habits
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectTemplate?.(template.id)}
                    disabled={activeTemplateIds.includes(template.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TemplateManager;

