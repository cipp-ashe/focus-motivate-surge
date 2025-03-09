
import React, { useEffect } from 'react';
import HabitTrackerHeader from './HabitTrackerHeader';
import ActiveTemplateList from './ActiveTemplateList';
import { ActiveTemplate } from './types';
import { eventBus } from '@/lib/eventBus';
import { 
  Drawer, 
  DrawerContent,
  DrawerClose,
  DrawerFooter,
  DrawerHeader, 
  DrawerTitle,
  DrawerDescription 
} from "@/components/ui/drawer";
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="space-y-4">
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
        <DrawerContent className={cn(
          isMobile ? 'max-h-[85vh]' : '',
          "p-0 rounded-t-lg border border-border overflow-hidden"
        )}>
          <DrawerHeader className="px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <DrawerTitle>Habit Configuration</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="text-xs">
              Manage your active habit templates
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4 overflow-y-auto">
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
          <DrawerFooter className="px-4 py-3 border-t bg-muted/30">
            <Button variant="outline" onClick={close}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default HabitTracker;
