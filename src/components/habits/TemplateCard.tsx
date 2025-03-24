
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Settings } from 'lucide-react';
import { ActiveTemplate } from '@/types/habits/types';

interface TemplateCardProps {
  template: ActiveTemplate;
  onRemove: () => void;
  onConfigure: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onRemove,
  onConfigure
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium line-clamp-1">{template.name}</CardTitle>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onConfigure} className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2 text-xs text-muted-foreground">
        <p className="line-clamp-2">{template.description || 'No description provided'}</p>
        <div className="mt-2">
          <p className="font-medium text-xs">Active days:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {template.activeDays.map((day) => (
              <span key={day} className="bg-secondary/50 rounded-full px-2 py-0.5 text-xs">
                {day.substring(0, 3)}
              </span>
            ))}
            {template.activeDays.length === 0 && (
              <span className="text-xs text-muted-foreground">No active days selected</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
