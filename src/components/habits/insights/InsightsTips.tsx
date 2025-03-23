
import React from 'react';
import { Lightbulb, InfoIcon, Clock } from 'lucide-react';
import { InsightsTipsProps } from '@/types/habit';

const InsightsTips: React.FC<InsightsTipsProps> = ({ habit }) => {
  if (!habit) return null;

  const renderInsight = (insight: string | { type: string, description: string }, index: number) => {
    // Handle both string and object formats
    const content = typeof insight === 'string' 
      ? insight 
      : insight.description;
      
    const type = typeof insight === 'string' 
      ? 'general'
      : insight.type;
      
    return (
      <div key={`insight-${index}`} className="flex items-start mb-2">
        <div className="mr-2 pt-0.5">
          <InfoIcon className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-sm">{content}</div>
      </div>
    );
  };

  const renderTip = (tip: string | { type: string, description: string }, index: number) => {
    // Handle both string and object formats
    const content = typeof tip === 'string' 
      ? tip 
      : tip.description;
      
    return (
      <div key={`tip-${index}`} className="flex items-start mb-2">
        <div className="mr-2 pt-0.5">
          <Lightbulb className="h-4 w-4 text-amber-500" />
        </div>
        <div className="text-sm">{content}</div>
      </div>
    );
  };

  // Render time preference
  const renderTimePreference = () => {
    if (!habit.timePreference) return null;
    
    const label = typeof habit.timePreference === 'string'
      ? habit.timePreference
      : habit.timePreference.description;
    
    return (
      <div className="flex items-center mb-3 text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        <span>Best time: {label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderTimePreference()}
      
      {habit.insights && habit.insights.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Insights</h4>
          {habit.insights.map(renderInsight)}
        </div>
      )}
      
      {habit.tips && habit.tips.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Tips</h4>
          {habit.tips.map(renderTip)}
        </div>
      )}
    </div>
  );
};

export default InsightsTips;
