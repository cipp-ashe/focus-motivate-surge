
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Settings2 } from "lucide-react";
import { ActiveTemplate, HabitTemplate, HabitDetail } from './types';
import { HabitList } from './HabitList';
import type { Habit } from '@/types/habits';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: ActiveTemplate;
  templateInfo: HabitTemplate;
  onRemove: () => void;
  onEdit: () => void;
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
  onEdit,
  getProgress,
  onHabitUpdate,
}) => {
  const habits: Habit[] = template.habits.map(convertToHabit);

  return (
    <div className={cn(
      "rounded-lg border border-border p-4 shadow-sm",
      "bg-gradient-to-br from-card to-card/95",
      "hover:shadow-md transition-all duration-200"
    )}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{templateInfo.name}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-secondary/80"
            onClick={onEdit}
            title="Edit template"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            title="Remove template"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {templateInfo.description && (
        <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {templateInfo.description}
        </div>
      )}
      
      <div className="bg-background/50 p-3 rounded-md">
        <HabitList
          habits={habits}
          onToggle={(habitId) => onHabitUpdate(habitId, true)}
        />
      </div>
    </div>
  );
};

export default TemplateCard;
