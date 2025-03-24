
import React from 'react';
import { HabitTemplate } from '@/types/habits/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomTemplatesListProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onAddTemplate: (template: HabitTemplate) => void;
  onRemoveTemplate: (templateId: string) => void;
}

export const CustomTemplatesList: React.FC<CustomTemplatesListProps> = ({
  templates,
  activeTemplateIds,
  onAddTemplate,
  onRemoveTemplate
}) => {
  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground mb-4">No custom templates yet</p>
        <p className="text-sm text-center text-muted-foreground mb-4">
          Create your own templates to organize your habits based on your lifestyle
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[50vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {template.defaultDays?.map(day => (
                  <span key={day} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {day}
                  </span>
                ))}
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium">Habits:</p>
                <ul className="text-xs text-muted-foreground pl-4 list-disc">
                  {template.defaultHabits.slice(0, 3).map(habit => (
                    <li key={habit.id}>{habit.name}</li>
                  ))}
                  {template.defaultHabits.length > 3 && (
                    <li>+{template.defaultHabits.length - 3} more</li>
                  )}
                </ul>
              </div>
            </CardContent>
            <div className="p-3 pt-0 flex justify-between mt-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveTemplate(template.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
              <Button
                size="sm"
                onClick={() => onAddTemplate(template)}
                disabled={activeTemplateIds.includes(template.id)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                {activeTemplateIds.includes(template.id) ? 'Active' : 'Add'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
