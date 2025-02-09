
import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { HabitDetail, HabitTemplate, ActiveTemplate } from './types';
import HabitMetric from './HabitMetric';

interface TemplateCardProps {
  template: ActiveTemplate;
  templateInfo: HabitTemplate;
  onConfigure: () => void;
  onRemove: () => void;
  getProgress: (habitId: string) => { value: boolean | number; streak: number; };
  onHabitUpdate: (habitId: string, value: boolean | number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  templateInfo,
  onConfigure,
  onRemove,
  getProgress,
  onHabitUpdate,
}) => {
  return (
    <Collapsible>
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CollapsibleTrigger className="flex-1 text-left">
            <CardTitle className="text-lg font-medium hover:text-primary transition-colors">
              {templateInfo.name}
            </CardTitle>
          </CollapsibleTrigger>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={onConfigure}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {template.habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <span className="font-medium text-sm">{habit.name}</span>
                  <HabitMetric
                    habit={habit}
                    progress={getProgress(habit.id)}
                    onUpdate={(value) => onHabitUpdate(habit.id, value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default TemplateCard;
