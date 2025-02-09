
import React from 'react';
import { BarChart, Edit, Trash2 } from 'lucide-react';
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{templateInfo.name}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={onToggleInsights}>
            <BarChart className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCustomize}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{templateInfo.description}</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {template.habits.map((habit) => (
            <div key={habit.id}>
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
