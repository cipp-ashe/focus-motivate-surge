
import React from 'react';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { ActiveTemplate } from './types';

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
  onConfigureTemplates?: () => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  activeTemplates,
  onConfigureTemplates 
}) => {
  return (
    <div className="space-y-6">
      <HabitTrackerHeader onConfigureTemplates={onConfigureTemplates} />
      <ActiveTemplateList
        activeTemplates={activeTemplates}
        getTodayProgress={() => ({})}
        onHabitUpdate={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
};

export default HabitTracker;
