
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HabitTemplate } from './types';

export interface CustomTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
}

const CustomTemplates: React.FC<CustomTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
}) => {
  if (templates.length === 0) {
    return (
      <div className="mt-4 p-4 text-center text-muted-foreground">
        No custom templates yet. Create your first template to see it here.
      </div>
    );
  }

  return (
    <ScrollArea className="mt-4 h-[300px]">
      <div className="space-y-2 p-1">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {template.category} • {template.defaultHabits.length} habits
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onSelect(template)}
                  disabled={activeTemplateIds.includes(template.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CustomTemplates;
