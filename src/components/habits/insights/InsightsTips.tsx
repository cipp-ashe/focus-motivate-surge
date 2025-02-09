
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HabitDetail } from '../types';

interface InsightsTipsProps {
  habit: HabitDetail;
}

const InsightsTips: React.FC<InsightsTipsProps> = ({ habit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights & Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habit.insights.map((insight, index) => (
          <div key={index} className="space-y-1">
            <p className="text-sm font-medium text-primary">
              {insight.type === 'streak' ? '🔥' :
               insight.type === 'completion' ? '✅' :
               insight.type === 'timing' ? '⏰' : '🔄'} {insight.description}
            </p>
          </div>
        ))}
        {habit.tips.map((tip, index) => (
          <p key={index} className="text-sm text-muted-foreground">
            💡 {tip}
          </p>
        ))}
      </CardContent>
    </Card>
  );
};

export default InsightsTips;
