
import React from 'react';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { ActiveTemplate } from './types';
import { eventBus } from '@/lib/eventBus';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
  onConfigureTemplates?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  activeTemplates,
  onConfigureTemplates,
  isOpen,
  onOpenChange
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Habit Configuration</DrawerTitle>
        </DrawerHeader>
        <div className="p-6 space-y-6">
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
      </DrawerContent>
    </Drawer>
  );
};

export default HabitTracker;
