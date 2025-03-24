
import React from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { HabitTemplate, ActiveTemplate } from '@/types/habits/types';

interface TemplateCardProps {
  template: HabitTemplate | ActiveTemplate;
  isActive?: boolean;
  onAdd?: () => void;
  onConfigure?: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isActive = false,
  onAdd,
  onConfigure
}) => {
  // Normalize template properties
  const templateName = 'name' in template ? template.name : template.templateId;
  const description = 'description' in template ? template.description : '';
  
  return (
    <Card className="overflow-hidden">
      <div
        className="h-3"
        style={{
          background: 'color' in template && template.color
            ? template.color
            : 'var(--primary)'
        }}
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{templateName}</h3>
            <CardDescription className="line-clamp-2 mt-1">
              {description}
            </CardDescription>
          </div>
          
          {isActive ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onConfigure}
              className="flex-shrink-0"
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onAdd}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {('defaultHabits' in template ? template.defaultHabits : template.habits).length} habit
          {('defaultHabits' in template ? template.defaultHabits : template.habits).length !== 1 ? 's' : ''}
        </div>
      </CardContent>
    </Card>
  );
};
