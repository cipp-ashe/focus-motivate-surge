
import React, { useState, useEffect } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  HabitTracker,
  HabitDebugLogger,
  TodaysHabitsSection,
} from '@/components/habits';
import { useTodaysHabits } from '@/hooks/habits/useTodaysHabits';
import { useHabitCompletion } from '@/hooks/habits/useHabitCompletion';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const { todaysHabits, refreshHabits } = useTodaysHabits();
  const isMobile = useIsMobile();
  
  // Use our custom hook for habit completion
  const { 
    completedHabits, 
    handleHabitComplete, 
    handleAddHabitToTasks 
  } = useHabitCompletion(todaysHabits, templates);

  // Find template for today's habits
  const todaysHabitsTemplateId = templates.find(t => 
    t.habits.some(h => todaysHabits.some(th => th.id === h.id))
  )?.templateId;
  
  // Only refresh habits when templates change
  useEffect(() => {
    refreshHabits();
  }, [templates, refreshHabits]);

  return (
    <HabitsPanelProvider>
      <div className="container mx-auto py-4 px-4">
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
        
        <div className="mb-5">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Habit Tracker
          </h1>
        </div>
        
        <div className={cn(
          "grid gap-4",
          isMobile 
            ? "grid-cols-1" 
            : todaysHabits && todaysHabits.length > 0 
              ? "grid-cols-1 lg:grid-cols-[1fr_300px]" 
              : "grid-cols-1"
        )}>
          {/* Today's Habits Card */}
          {todaysHabits && todaysHabits.length > 0 && (
            <TodaysHabitsSection
              key={`habits-${templates.length}`}
              todaysHabits={todaysHabits}
              completedHabits={completedHabits}
              onHabitComplete={handleHabitComplete}
              onAddHabitToTasks={handleAddHabitToTasks}
              templateId={todaysHabitsTemplateId}
            />
          )}

          <div className="bg-background">
            <HabitTracker />
          </div>
        </div>
      </div>
    </HabitsPanelProvider>
  );
};

export default HabitsPage;
