
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ActiveTemplate, HabitTemplate, HabitDetail } from './types';
import { HabitList } from './HabitList';
import type { Habit } from '@/types/habits';

interface TemplateCardProps {
  template: ActiveTemplate;
  templateInfo: HabitTemplate;
  onRemove: () => void;
  getProgress: (habitId: string) => { value: boolean | number; streak: number; };
  onHabitUpdate: (habitId: string, value: boolean | number) => void;
}

const convertToHabit = (habitDetail: HabitDetail): Habit => ({
  ...habitDetail,
  completed: false,
  streak: 0,
  lastCompleted: null,
  category: 'Personal',
  timePreference: 'Anytime'
});

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  templateInfo,
  onRemove,
  getProgress,
  onHabitUpdate,
}) => {
  const habits: Habit[] = template.habits.map(convertToHabit);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{templateInfo.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <HabitList
          habits={habits}
          getProgress={getProgress}
          onHabitUpdate={onHabitUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
