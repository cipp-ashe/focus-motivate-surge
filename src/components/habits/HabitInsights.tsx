
import React from 'react';
import { Card } from '@/components/ui/card';
import { HabitDetail } from '@/types/habit';

interface InsightsTipsProps {
  name: string;
  description?: string;
  timePreference?: string;
  insights?: any[];
  tips?: any[];
}

const InsightsTips: React.FC<InsightsTipsProps> = ({ 
  name, 
  description, 
  timePreference, 
  insights = [], 
  tips = [] 
}) => {
  return (
    <div className="space-y-3">
      {insights && insights.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium mb-1">Insights</h4>
          <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            {insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4 className="text-sm font-medium mb-1">Insights</h4>
          <p className="text-sm text-muted-foreground">
            Track your progress to generate personalized insights.
          </p>
        </div>
      )}
      
      {tips && tips.length > 0 ? (
        <div>
          <h4 className="text-sm font-medium mb-1">Tips</h4>
          <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            {tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4 className="text-sm font-medium mb-1">Tips</h4>
          <p className="text-sm text-muted-foreground">
            {timePreference 
              ? `Try to complete "${name}" during the ${timePreference.toLowerCase()} for best results.`
              : `Consistency is key for building the "${name}" habit.`}
          </p>
        </div>
      )}
    </div>
  );
};

interface HabitInsightsProps {
  habit: HabitDetail;
  progress?: any[]; // Progress data if available
}

export const HabitInsights: React.FC<HabitInsightsProps> = ({ habit, progress }) => {
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
