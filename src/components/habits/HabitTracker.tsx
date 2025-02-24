
import React from 'react';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { ActiveTemplate } from './types';
import { eventBus } from '@/lib/eventBus';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useHabitsPanel } from '@/hooks/useHabitsPanel';

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
  onConfigureTemplates?: () => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  activeTemplates,
  onConfigureTemplates,
}) => {
  const { isOpen, close } = useHabitsPanel();

  return (
    <Drawer open={isOpen} onOpenChange={close}>
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
