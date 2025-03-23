
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface InsightsTipsProps {
  name: string;
  description?: string;
  timePreference?: string;
  insights: string[];
  tips: string[];
}

const InsightsTips: React.FC<InsightsTipsProps> = ({
  name,
  description,
  timePreference,
  insights = [],
  tips = []
}) => {
  return (
    <div className="space-y-4">
      {(insights && insights.length > 0) ? (
        <div>
          <h4 className="font-medium text-sm">Insights</h4>
          <ul className="mt-2 space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4 className="font-medium text-sm">No Insights Yet</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Keep practicing {name.toLowerCase()} to generate insights based on your performance.
          </p>
        </div>
      )}

      <Separator />

      {(tips && tips.length > 0) ? (
        <div>
          <h4 className="font-medium text-sm">Tips</h4>
          <ul className="mt-2 space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h4 className="font-medium text-sm">Tips for {name}</h4>
          <ul className="mt-2 space-y-2">
            <li className="text-sm">
              {timePreference === 'Morning' ? 
                'Try setting a consistent wake-up time to establish a routine.' :
                timePreference === 'Evening' ?
                'Associate this habit with another evening activity you already do consistently.' :
                'Start with small, achievable goals and gradually increase difficulty.'}
            </li>
            <li className="text-sm">
              Track your progress daily to stay motivated and see your improvements.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InsightsTips;
