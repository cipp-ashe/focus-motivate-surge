
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
        <HabitsPanelProvider>
          <div className="container mx-auto py-4 px-4">
            <div className="mb-5">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                Habit Tracker
              </h1>
            </div>
            
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <HabitsContent isMobile={isMobile} />
            </ErrorBoundary>
          </div>
        </HabitsPanelProvider>
      </HabitProvider>
    </ErrorBoundary>
  );
};

// Separated component to prevent the entire page from crashing if there's an issue
const HabitsContent = ({ isMobile }: { isMobile: boolean }) => {
  const { templates } = useHabitContext();
  const { todaysHabits, refreshHabits } = useTodaysHabits();
  
  // Use our custom hook for habit completion
  const { 
    completedHabits, 
    dismissedHabits,
    handleHabitComplete, 
    handleAddHabitToTasks 
  } = useHabitCompletion(todaysHabits, templates);

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

      <div className="bg-background">
        <HabitTracker />
      </div>
    </div>
  );
};

export default HabitsPage;
