
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

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Habits</h2>
    <p className="mb-2">There was a problem loading the habits component.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
    </details>
  </div>
);

const HabitsPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HabitProvider>
        <NoteProvider> {/* Add NoteProvider here to wrap all habit components */}
          <HabitsPanelProvider>
            <div className="container mx-auto py-4 px-4">
              <div className="mb-5">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Habit Tracker
                </h1>
                <p className="text-muted-foreground">Build consistent habits and track your progress</p>
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
  
  return (
    <div className={cn(
      "grid gap-4",
      isMobile 
        ? "grid-cols-1" 
        : todaysHabits && todaysHabits.length > 0 
          ? "grid-cols-1 lg:grid-cols-[1fr_300px]" 
          : "grid-cols-1"
    )}>
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

      <div className="bg-background h-full">
        <HabitTracker />
      </div>
    </div>
  );
};

export default HabitsPage;
