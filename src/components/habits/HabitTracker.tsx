
import React, { useEffect } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface HabitTrackerProps {
  activeTemplates: ActiveTemplate[];
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ 
  activeTemplates,
}) => {
  const { isOpen, close } = useHabitsPanel();
  const isMobile = useIsMobile();
  
  // Debug when drawer opens/closes and active templates
  useEffect(() => {
    console.log("HabitTracker drawer isOpen:", isOpen);
    console.log("HabitTracker activeTemplates:", activeTemplates);
  }, [isOpen, activeTemplates]);

  if (activeTemplates.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-card/50 hover:bg-card/80 transition-colors">
        <CardHeader>
          <CardTitle className="text-center text-muted-foreground">No Active Templates</CardTitle>
          <CardDescription className="text-center">
            Add templates using the "Manage Habit Templates" button to start tracking your habits
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Active Templates</h2>
        <ActiveTemplateList
          activeTemplates={activeTemplates}
          getTodayProgress={() => ({ value: false, streak: 0 })}
          onHabitUpdate={() => {}}
          onRemove={(templateId) => {
            eventBus.emit('habit:template-delete', { templateId });
          }}
        />
      </div>

      <Drawer open={isOpen} onOpenChange={close}>
        <DrawerContent className={isMobile ? 'max-h-[85vh]' : ''}>
          <DrawerHeader>
            <DrawerTitle>Habit Configuration</DrawerTitle>
            <DrawerDescription>
              Manage your active habit templates
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6 space-y-6 overflow-y-auto">
            <HabitTrackerHeader />
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
    </>
  );
};

export default HabitTracker;
