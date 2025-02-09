
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
          />
        );
      case 'duration':
        const durationValue = typeof progress.value === 'number' ? progress.value : 0;
        const durationTarget = habit.metrics.target || 30;
        return (
          <div className="space-y-2">
            <Progress value={(durationValue / durationTarget) * 100} />
            <p className="text-sm text-muted-foreground">
              {durationValue} / {durationTarget} min
            </p>
          </div>
        );
      case 'count':
        const countValue = typeof progress.value === 'number' ? progress.value : 0;
        const countTarget = habit.metrics.target || 1;
        return (
          <div className="space-y-2">
            <Progress value={(countValue / countTarget) * 100} />
            <p className="text-sm text-muted-foreground">
              {countValue} / {countTarget}
            </p>
          </div>
        );
      case 'rating':
        const ratingValue = typeof progress.value === 'number' ? progress.value : 0;
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={rating <= ratingValue ? "default" : "ghost"}
                size="icon"
                onClick={() => onUpdate(rating)}
              >
                <Star className="h-4 w-4" />
              </Button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-lg bg-card">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{habit.name}</h4>
        {progress.streak > 0 && (
          <span className="text-sm text-muted-foreground">
            {progress.streak} day streak
          </span>
        )}
      </div>
      {renderMetric()}
    </div>
  );
};

export default HabitMetric;
