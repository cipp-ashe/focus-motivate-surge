
import React from 'react';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { ActiveTemplate } from './types';
import { eventBus } from '@/lib/eventBus';

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
        getTodayProgress={() => ({ value: false, streak: 0 })}
        onHabitUpdate={() => {}}
        onRemove={(templateId) => {
          eventBus.emit('habit:template-delete', { templateId });
        }}
      />
    </div>
  );
};

export default HabitTracker;
