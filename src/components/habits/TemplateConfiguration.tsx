
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitTemplate, ActiveTemplate, DayOfWeek, DAYS_OF_WEEK } from './types';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import HabitForm from './ConfigurationDialog/HabitForm';
import { createEmptyHabit } from './types';

interface TemplateConfigurationProps {
  availableTemplates?: HabitTemplate[];
  activeTemplateIds?: string[];
  onSelectTemplate?: (templateId: string) => void;
  templateToEdit?: ActiveTemplate;
  onUpdateTemplate?: (updates: Partial<ActiveTemplate>) => void;
  onUpdateDays?: (days: DayOfWeek[]) => void;
  onClose?: () => void;
  onCreateTemplate?: () => void;
}

const TemplateConfiguration: React.FC<TemplateConfigurationProps> = ({
  availableTemplates = [],
  activeTemplateIds = [],
  onSelectTemplate,
  templateToEdit,
  onUpdateTemplate,
  onUpdateDays,
  onClose,
  onCreateTemplate,
}) => {
  if (templateToEdit) {
    return (
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active Days</h4>
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
                className="flex-1 min-w-[40px]"
              >
                {day.charAt(0)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Habits</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onUpdateTemplate?.({
                  habits: [...templateToEdit.habits, createEmptyHabit()]
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-4 pr-4">
              {templateToEdit.habits.map((habit, index) => (
                <HabitForm
                  key={habit.id}
                  habit={habit}
                  onUpdate={(updates) => {
                    const updatedHabits = [...templateToEdit.habits];
                    updatedHabits[index] = { ...habit, ...updates };
                    onUpdateTemplate?.({ habits: updatedHabits });
                  }}
                  onDelete={() => {
                    const updatedHabits = templateToEdit.habits.filter((_, i) => i !== index);
                    onUpdateTemplate?.({ habits: updatedHabits });
                  }}
                  onDragStart={() => {}}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
      <div className="space-y-4">
        <Button 
          onClick={onCreateTemplate}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mb-4"
        >
          <Plus className="h-4 w-4" />
          Create New Template
        </Button>
        {availableTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {template.defaultHabits.length} habits
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectTemplate?.(template.id)}
                  disabled={activeTemplateIds.includes(template.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TemplateConfiguration;
