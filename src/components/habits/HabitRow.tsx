
import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HabitDetail } from '@/types/habits/types';
import { HabitMetric } from './HabitMetric';

interface HabitRowProps {
  habit: HabitDetail;
  isCompleted?: boolean;
  onComplete?: () => void;
  onDelete?: () => void;
  dragHandleProps?: any;
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  isCompleted = false,
  onComplete,
  onDelete,
  dragHandleProps,
}) => {
  return (
    <Card className="p-4 mb-2 border-theme-medium">
      <div className="flex items-center gap-4">
        {dragHandleProps && (
          <div {...dragHandleProps} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium">{habit.name}</h3>
          {habit.description && (
            <p className="text-xs text-muted-foreground">{habit.description}</p>
          )}
        </div>
        <div>
          <HabitMetric
            habit={habit}
            isCompleted={isCompleted}
            onComplete={onComplete || (() => {})}
          />
        </div>
      </div>
    </Card>
  );
};
