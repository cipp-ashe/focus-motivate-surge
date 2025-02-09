
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HabitTemplate } from './types';

interface TemplateConfigurationProps {
  availableTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (templateId: string) => void;
}

const TemplateConfiguration: React.FC<TemplateConfigurationProps> = ({
  availableTemplates,
  activeTemplateIds,
  onSelectTemplate,
}) => {
  return (
    <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
      <div className="space-y-4">
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
                  onClick={() => onSelectTemplate(template.id)}
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
