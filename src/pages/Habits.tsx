
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { cn } from '@/lib/utils';
import { 
  HabitTracker,
  HabitDebugLogger,
  TodaysHabitsSection,
} from '@/components/habits';
import { useTodaysHabits } from '@/hooks/habits/useTodaysHabits';
import { useHabitCompletion } from '@/hooks/habits/useHabitCompletion';
import { HabitsPanelProvider } from '@/hooks/ui/useHabitsPanel';
import { ErrorBoundary } from 'react-error-boundary';
import { HabitProvider, useHabitContext } from '@/contexts/habits/HabitContext';
import { eventManager } from '@/lib/events/EventManager';
import { HabitDetail } from '@/components/habits/types';
import { NoteProvider } from '@/contexts/notes/NoteContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-6 border border-red-300 bg-red-50/30 dark:bg-red-900/10 rounded-xl shadow-sm backdrop-blur-sm">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">Error Loading Habits</h2>
    <p className="mb-3 text-red-800/70 dark:text-red-300/70">There was a problem loading the habits component.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-black/20 p-3 rounded-lg">
      <summary className="cursor-pointer font-medium">Technical Details</summary>
      <p className="mt-2 font-mono text-xs">{error.message}</p>
    </details>
  </div>
);

const HabitsPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HabitProvider>
        <NoteProvider>
          <HabitsPanelProvider>
            <div className="container mx-auto py-6 px-4">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 animate-gradient-subtle">
                  Habit Tracker
                </h1>
                <p className="text-muted-foreground mt-1">Build consistent habits and track your progress</p>
              </div>
              
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <HabitsContent isMobile={isMobile} />
              </ErrorBoundary>
            </div>
          </HabitsPanelProvider>
        </NoteProvider>
      </HabitProvider>
    </ErrorBoundary>
  );
};

// Separated component to prevent the entire page from crashing if there's an issue
const HabitsContent = ({ isMobile }: { isMobile: boolean }) => {
  const { templates } = useHabitContext();
  const { todaysHabits, refreshHabits } = useTodaysHabits();
  
  // Get the habit completion functions
  const { completeHabit, dismissHabit } = useHabitCompletion();
  
  // Track completed and dismissed habits locally
  // Changed to arrays of strings to match expected type in TodaysHabitsSection
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [dismissedHabits, setDismissedHabits] = useState<string[]>([]);
  
  // Handler functions that use the useHabitCompletion hooks
  const handleHabitComplete = (habitId: string) => {
    const success = completeHabit(habitId, new Date().toISOString());
    if (success) {
      setCompletedHabits(prev => prev.includes(habitId) ? prev : [...prev, habitId]);
    }
    return success;
  };
  
  // Handle adding habit to tasks - fixed implementation
  const handleAddHabitToTasks = (habit: HabitDetail) => {
    console.log('Adding habit to tasks:', habit.id, habit.name);
    
    // Emit habit schedule event with all required data
    // Use type assertion to ensure type compatibility
    eventManager.emit('habit:schedule', {
      habitId: habit.id,
      templateId: habit.relationships?.templateId || '',
      name: habit.name,
      duration: habit.metrics.target || 1500, // Default to 25 minutes
      date: new Date().toDateString(),
      metricType: habit.metrics.type as string
    });
    
    // Force task update after a short delay
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
      eventManager.emit('habits:check-pending', {});
    }, 500);
    
    return true;
  };

  // Generate a stable key for the TodaysHabitsSection based on template IDs
  const todaysHabitsSectionKey = templates
    .map(t => t.templateId)
    .sort()
    .join('-');
  
  // Only refresh habits when templates change
  useEffect(() => {
    console.log('Templates changed, refreshing habits');
    refreshHabits();
  }, [templates, refreshHabits]);
  
  // For mobile, use a stacked layout
  if (isMobile) {
    return (
      <div className="grid gap-5 grid-cols-1">
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
        
        {/* Today's Habits Card */}
        {todaysHabits && todaysHabits.length > 0 && (
          <TodaysHabitsSection
            key={`today-habits-${todaysHabitsSectionKey}`}
            todaysHabits={todaysHabits}
            completedHabits={completedHabits}
            dismissedHabits={dismissedHabits}
            onHabitComplete={handleHabitComplete}
            onAddHabitToTasks={handleAddHabitToTasks}
            templateId={todaysHabits[0]?.relationships?.templateId}
          />
        )}

        <div className="bg-background/40 backdrop-blur-sm rounded-xl h-full shadow-sm border border-border/50">
          <HabitTracker />
        </div>
      </div>
    );
  }
  
  // For desktop, use a resizable layout with TodaysHabits taking less space
  return (
    <div className="h-[calc(100vh-12rem)]">
      <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      
      {todaysHabits && todaysHabits.length > 0 ? (
        <ResizablePanelGroup direction="horizontal" className="h-full mt-4 rounded-xl overflow-hidden border border-border/40 shadow-sm">
          {/* Habit Tracker section - larger */}
          <ResizablePanel defaultSize={75} minSize={55} className="transition-all duration-300">
            <div className="bg-background/40 backdrop-blur-sm h-full pr-1 pl-1 pt-1">
              <HabitTracker />
            </div>
          </ResizablePanel>
          
          {/* Resizable handle */}
          <ResizableHandle withHandle className="bg-border/30 hover:bg-primary/20 transition-colors" />
          
          {/* Today's Habits section - smaller */}
          <ResizablePanel defaultSize={25} minSize={20} className="transition-all duration-300">
            <TodaysHabitsSection
              key={`today-habits-${todaysHabitsSectionKey}`}
              todaysHabits={todaysHabits}
              completedHabits={completedHabits}
              dismissedHabits={dismissedHabits}
              onHabitComplete={handleHabitComplete}
              onAddHabitToTasks={handleAddHabitToTasks}
              templateId={todaysHabits[0]?.relationships?.templateId}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="bg-background/40 backdrop-blur-sm h-full mt-4 rounded-xl border border-border/40 shadow-sm">
          <HabitTracker />
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
