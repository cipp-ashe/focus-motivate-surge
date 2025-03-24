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
import { HabitDetail } from '@/types/habits/types';
import { NoteProvider } from '@/contexts/notes/NoteContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { motion } from 'framer-motion';
import { useHabitTaskProcessor } from '@/hooks/tasks/habitTasks/useHabitTaskProcessor';

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
            <motion.div 
              className="page-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="page-header">
                <h1 className="page-title">Habit Tracker</h1>
                <p className="page-description">Build consistent habits and track your progress</p>
              </div>
              
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <HabitsContent isMobile={isMobile} />
              </ErrorBoundary>
            </motion.div>
          </HabitsPanelProvider>
        </NoteProvider>
      </HabitProvider>
    </ErrorBoundary>
  );
};

const HabitsContent = ({ isMobile }: { isMobile: boolean }) => {
  const { templates } = useHabitContext();
  const { todaysHabits, refreshHabits } = useTodaysHabits();
  const { handleHabitSchedule } = useHabitTaskProcessor();
  
  const { completeHabit, dismissHabit } = useHabitCompletion();
  
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [dismissedHabits, setDismissedHabits] = useState<string[]>([]);
  
  const handleHabitComplete = (habitId: string) => {
    const success = completeHabit(habitId, new Date().toISOString());
    if (success) {
      setCompletedHabits(prev => prev.includes(habitId) ? prev : [...prev, habitId]);
    }
    return success;
  };
  
  const handleAddHabitToTasks = (habit: HabitDetail) => {
    console.log('Adding habit to tasks:', habit.id, habit.name);
    
    handleHabitSchedule({
      habitId: habit.id,
      templateId: habit.relationships?.templateId || '',
      name: habit.name,
      duration: habit.metrics.goal || habit.metrics.target || 1500,
      date: new Date().toDateString(),
      metricType: habit.metrics.type
    });
    
    setTimeout(() => {
      window.dispatchEvent(new Event('force-task-update'));
      eventManager.emit('habits:check-pending', {});
    }, 500);
    
    return true;
  };

  const todaysHabitsSectionKey = templates
    .map(t => t.templateId)
    .sort()
    .join('-');
  
  useEffect(() => {
    console.log('Templates changed, refreshing habits');
    refreshHabits();
  }, [templates, refreshHabits]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isMobile) {
    return (
      <motion.div 
        className="grid gap-5 grid-cols-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
        
        {todaysHabits && todaysHabits.length > 0 && (
          <motion.div variants={itemVariants}>
            <TodaysHabitsSection
              key={`today-habits-${todaysHabitsSectionKey}`}
              todaysHabits={todaysHabits}
              completedHabits={completedHabits}
              dismissedHabits={dismissedHabits}
              onHabitComplete={handleHabitComplete}
              onAddHabitToTasks={handleAddHabitToTasks}
              templateId={todaysHabits[0]?.relationships?.templateId}
            />
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="card-glass h-full shadow-sm">
          <HabitTracker />
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-12rem)]">
      <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      
      {todaysHabits && todaysHabits.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mt-4"
        >
          <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl overflow-hidden border border-border/20 shadow-sm">
            <ResizablePanel defaultSize={75} minSize={55} className="transition-all duration-300">
              <div className="glass-panel h-full p-1">
                <HabitTracker />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle className="bg-border/20 hover:bg-primary/10 transition-colors" />
            
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
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="glass-panel h-full mt-4 rounded-xl border border-border/20 shadow-sm"
        >
          <HabitTracker />
        </motion.div>
      )}
    </div>
  );
};

export default HabitsPage;
