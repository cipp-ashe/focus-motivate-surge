
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { HabitTemplate } from '../types';

interface AvailableTemplatesProps {
  templates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelect: (template: HabitTemplate) => void;
}

const AvailableTemplates: React.FC<AvailableTemplatesProps> = ({
  templates,
  activeTemplateIds,
  onSelect,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {template.category} • {template.defaultHabits.length} habits
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelect(template)}
              disabled={activeTemplateIds.includes(template.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailableTemplates;
