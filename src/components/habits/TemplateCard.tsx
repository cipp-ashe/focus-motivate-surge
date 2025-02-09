
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  getProgress: (habitId: string) => ProgressResult;
  onHabitUpdate: (habitId: string, value: boolean | number) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  templateInfo,
  onCustomize,
  onRemove,
  getProgress,
  onHabitUpdate,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{templateInfo.name}</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onCustomize}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
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
