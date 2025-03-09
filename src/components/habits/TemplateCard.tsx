
import React from 'react';
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
  id: habitDetail.id,
  name: habitDetail.name,
  description: habitDetail.description || 'No description provided',
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
    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{templateInfo.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground mb-3">
        {templateInfo.description}
      </div>
      <HabitList
        habits={habits}
        onToggle={(habitId) => onHabitUpdate(habitId, true)}
      />
    </div>
  );
};

export default TemplateCard;
