
import React from 'react';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { ActiveTemplate } from './types';
import { eventBus } from '@/lib/eventBus';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerDescription 
} from "@/components/ui/drawer";
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
  
  // Debug when drawer opens/closes
  React.useEffect(() => {
    console.log("HabitTracker drawer isOpen:", isOpen);
  }, [isOpen]);

  // Define a handler for configure templates that properly manages the drawer closing
  const handleConfigureTemplates = () => {
    // First close the drawer
    close();
    
    // Then wait for drawer animation to complete before opening template config
    setTimeout(() => {
      if (onConfigureTemplates) {
        onConfigureTemplates();
      }
    }, 500);
  };

  return (
    <Drawer open={isOpen} onOpenChange={close}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Habit Configuration</DrawerTitle>
          <DrawerDescription>
            Manage your active habit templates
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 space-y-6">
          <HabitTrackerHeader onConfigureTemplates={handleConfigureTemplates} />
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
