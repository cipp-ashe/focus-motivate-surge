
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
      "hover:shadow-md transition-all duration-200 relative overflow-hidden"
    )}>
      {/* Card decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-purple-500/60" />
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">{templateInfo.name}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-secondary/80"
            onClick={onEdit}
            title="Edit template"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            title="Remove template"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {templateInfo.description && (
        <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {templateInfo.description}
        </div>
      )}
      
      <div className="bg-background/50 p-2 rounded-md">
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          Active days: {template.activeDays.join(', ')}
        </div>
        <div className="divide-y divide-border/30">
          {habits.map((habit) => (
            <div key={habit.id} className="py-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{habit.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-6 px-2 text-xs rounded-full",
                    getProgress(habit.id).value 
                      ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" 
                      : "bg-secondary/50 hover:bg-secondary"
                  )}
                  onClick={() => onHabitUpdate(habit.id, true)}
                >
                  {getProgress(habit.id).value ? "Completed" : "Mark Complete"}
                </Button>
              </div>
              {habit.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{habit.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
