
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HabitProgress } from '../types';

interface CompletionRateProps {
  progress: HabitProgress[];
}

const CompletionRate: React.FC<CompletionRateProps> = ({ progress }) => {
  const getCompletionRate = (): number => {
    const totalDays = progress.length;
    if (totalDays === 0) return 0;

    const completedDays = progress.filter(p => 
      typeof p.value === 'boolean' ? p.value : p.value > 0
    ).length;

    return (completedDays / totalDays) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Completion Rate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-center">
          <span className="text-3xl font-bold text-primary">
            {Math.round(getCompletionRate())}%
          </span>
        </div>
        <Progress value={getCompletionRate()} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default CompletionRate;
