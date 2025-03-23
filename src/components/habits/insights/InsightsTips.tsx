
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lightbulb } from "lucide-react";

interface InsightsTipsProps {
  insights?: string[] | { type: string; text: string }[];
  tips?: string[] | { type: string; text: string; description?: string }[];
}

const InsightsTips: React.FC<InsightsTipsProps> = ({ insights = [], tips = [] }) => {
  // Helper to convert strings to objects if needed
  const formatItems = (items: any[]) => {
    return items.map((item, index) => {
      if (typeof item === 'string') {
        return { type: 'default', text: item };
      }
      return item;
    });
  };

  const formattedInsights = formatItems(insights);
  const formattedTips = formatItems(tips);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {formattedInsights.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Insights
            </CardTitle>
            <CardDescription className="text-xs">
              Knowledge to deepen your understanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {formattedInsights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-0.5 text-blue-500">•</span>
                  <span>{insight.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {formattedTips.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Tips
            </CardTitle>
            <CardDescription className="text-xs">
              Practical advice for better results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {formattedTips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-0.5 text-emerald-500">•</span>
                  <div>
                    <div>{tip.text}</div>
                    {tip.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {tip.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InsightsTips;
