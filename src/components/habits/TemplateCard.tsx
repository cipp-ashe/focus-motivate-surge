import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, SettingsIcon, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ActiveTemplate } from '@/types/habit';
import { TemplateCardProps } from '@/types/habitComponents';

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onConfigure, onRemove }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {template.habits.map((habit) => (
          <Badge key={habit.id} className="mr-2">{habit.name}</Badge>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onConfigure}>
          <SettingsIcon className="mr-2 h-4 w-4" />
          Configure
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="destructive" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button onClick={onConfigure}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
