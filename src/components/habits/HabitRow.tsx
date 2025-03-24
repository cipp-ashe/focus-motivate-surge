
import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HabitDetail } from './types';
import HabitMetric from './HabitMetric';

interface HabitRowProps {
  habit: HabitDetail;
  value: boolean | number;
  onUpdate: (value: boolean | number) => void;
  onDelete?: () => void;
  dragHandleProps?: any;
}

const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  value,
  onUpdate,
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
        </div>
        <div>
          <HabitMetric
            habit={habit}
            progress={{ value, streak: 0 }}
            onUpdate={onUpdate}
          />
        </div>
      </div>
    </Card>
  );
};

export default HabitRow;
