
import React from 'react';
import { Card } from '@/components/ui/card';
import InsightsTips from './insights/InsightsTips';
import type { HabitDetail } from './types';

interface HabitInsightsProps {
  habit: HabitDetail;
  progress?: any[]; // Add progress prop to fix TS error
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habit, progress }) => {
  if (!habit) return null;

  return (
    <Card className="shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Insights & Tips</h3>
      
      <InsightsTips 
        name={habit.name}
        description={habit.description}
        timePreference={habit.timePreference}
        insights={habit.insights || []}
        tips={habit.tips || []}
      />
    </Card>
  );
};

export default HabitInsights;
