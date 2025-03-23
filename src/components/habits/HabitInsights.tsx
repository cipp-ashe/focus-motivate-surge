
import React from 'react';
import { Card } from '@/components/ui/card';
import InsightsTips from './insights/InsightsTips';
import type { HabitDetail } from './types';

interface HabitInsightsProps {
  habit: HabitDetail;
}

// Make sure the InsightsTips component prop matches what we're passing
const HabitInsights: React.FC<HabitInsightsProps> = ({ habit }) => {
  if (!habit) return null;

  return (
    <Card className="shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Insights & Tips</h3>
      
      {/* Use properties directly without wrapping them in habitData */}
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
