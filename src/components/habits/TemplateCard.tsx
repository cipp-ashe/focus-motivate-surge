
import React from 'react';
import { Edit, Trash2, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HabitDetail, HabitTemplate } from './types';
import HabitMetric from './HabitMetric';

interface ProgressResult {
  value: boolean | number;
  streak: number;
}

interface TemplateCardProps {
  template: {
    templateId: string;
    habits: HabitDetail[];
    activeDays: string[];
  };
  templateInfo: HabitTemplate;
  onCustomize: () => void;
  onRemove: () => void;
  onToggleInsights: () => void;
  getProgress: (habitId: string) => ProgressResult;
  onHabitUpdate: (habitId: string, value: boolean | number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  templateInfo,
  onCustomize,
  onRemove,
  onToggleInsights,
  getProgress,
  onHabitUpdate,
}) => {
  return (
    <Card className="bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{templateInfo.name}</CardTitle>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={onToggleInsights} className="h-8 w-8 p-0">
            <BarChart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onCustomize} className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {template.habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">{habit.name}</span>
              <HabitMetric
                habit={habit}
                progress={getProgress(habit.id)}
                onUpdate={(value) => onHabitUpdate(habit.id, value)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
