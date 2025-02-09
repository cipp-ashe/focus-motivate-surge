
import React from 'react';
import { HabitDetail, HabitProgress } from './types';
import CompletionRate from './insights/CompletionRate';
import BestStreak from './insights/BestStreak';
import PreferredTime from './insights/PreferredTime';
import ProgressChart from './insights/ProgressChart';
import InsightsTips from './insights/InsightsTips';

interface HabitInsightsProps {
  habit: HabitDetail;
  progress: HabitProgress[];
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habit, progress }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CompletionRate progress={progress} />
        <BestStreak progress={progress} />
        <PreferredTime progress={progress} />
      </div>
      <div>
        <ProgressChart habit={habit} progress={progress} />
      </div>
      <div>
        <InsightsTips habit={habit} />
      </div>
    </div>
  );
};

export default HabitInsights;
