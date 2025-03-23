
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface InsightsTipsProps {
  name: string;
  description: string;
  timePreference: string;
  insights: string[];
  tips: string[];
}

const InsightsTips: React.FC<InsightsTipsProps> = ({
  name,
  description,
  timePreference,
  insights,
  tips
}) => {
  return (
    <div className="space-y-4">
      {insights && insights.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-2">Insights</h4>
          <ScrollArea className="h-[100px]">
            <ul className="list-disc pl-5 space-y-1">
              {insights.map((insight, index) => (
                <li key={`insight-${index}`} className="text-sm">
                  {insight}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      {tips && tips.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-2">Tips</h4>
          <ScrollArea className="h-[100px]">
            <ul className="list-disc pl-5 space-y-1">
              {tips.map((tip, index) => (
                <li key={`tip-${index}`} className="text-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default InsightsTips;
