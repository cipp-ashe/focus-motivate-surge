
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-sm font-medium">{templateInfo.name}</CardTitle>
        <div className="flex space-x-0.5">
          <Button variant="ghost" size="sm" onClick={onToggleInsights} className="h-6 w-6 p-0">
            <BarChart className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onCustomize} className="h-6 w-6 p-0">
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove} className="h-6 w-6 p-0 text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-1">
        <div className="grid grid-cols-2 gap-1">
          {template.habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between px-2 py-1 rounded-sm bg-muted/30 text-[0.7rem]">
              <span className="font-medium truncate max-w-[80px]">{habit.name}</span>
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
