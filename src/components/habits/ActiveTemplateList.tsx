
import React from 'react';
import { ActiveTemplate } from '@/types/habits/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, X } from 'lucide-react';

interface ActiveTemplateListProps {
  templates: ActiveTemplate[];
  onRemoveTemplate: (templateId: string) => void;
  onConfigureTemplate: (template: ActiveTemplate) => void;
}

export const ActiveTemplateList: React.FC<ActiveTemplateListProps> = ({
  templates,
  onRemoveTemplate,
  onConfigureTemplate
}) => {
  return (
    <div className="space-y-3">
      {templates.map(template => (
        <Card key={template.templateId} className="overflow-hidden">
          <div className="h-1.5 bg-primary" />
          <CardContent className="p-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{template.name || template.templateId}</h3>
                {template.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {template.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {template.activeDays.map(day => (
                    <span
                      key={day}
                      className="inline-block bg-muted text-xs px-1.5 py-0.5 rounded"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onConfigureTemplate(template)}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Configure</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveTemplate(template.templateId)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
