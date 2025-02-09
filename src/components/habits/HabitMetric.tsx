import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import { HabitDetail } from './types';

interface ProgressResult {
  value: boolean | number;
  streak: number;
}

interface HabitMetricProps {
  habit: HabitDetail;
  progress: ProgressResult;
  onUpdate: (value: boolean | number) => void;
}

const HabitMetric: React.FC<HabitMetricProps> = ({
  habit,
  progress,
  onUpdate,
}) => {
  const renderMetric = () => {
    switch (habit.metrics.type) {
      case 'boolean':
        return (
          <Checkbox
            checked={!!progress.value}
            onCheckedChange={(checked) => onUpdate(!!checked)}
            className="h-3 w-3"
          />
        );
      case 'timer':
        const timerValue = typeof progress.value === 'number' ? progress.value : 0;
        const timerTarget = habit.metrics.target || 30;
        return (
          <div className="space-y-0.5 w-16">
            <Progress value={(timerValue / timerTarget) * 100} className="h-1" />
            <p className="text-[0.65rem] text-muted-foreground text-right">
              {timerValue}/{timerTarget}m
            </p>
          </div>
        );
      case 'count':
        const countValue = typeof progress.value === 'number' ? progress.value : 0;
        const countTarget = habit.metrics.target || 1;
        return (
          <div className="space-y-0.5 w-16">
            <Progress value={(countValue / countTarget) * 100} className="h-1" />
            <p className="text-[0.65rem] text-muted-foreground text-right">
              {countValue}/{countTarget}
            </p>
          </div>
        );
      case 'rating':
        const ratingValue = typeof progress.value === 'number' ? progress.value : 0;
        return (
          <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={rating <= ratingValue ? "default" : "ghost"}
                size="icon"
                onClick={() => onUpdate(rating)}
                className="h-3 w-3 p-0"
              >
                <Star className="h-1.5 w-1.5" />
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return renderMetric();
};

export default HabitMetric;
