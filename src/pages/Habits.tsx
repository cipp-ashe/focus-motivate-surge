
import React from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  HabitTracker,
  HabitDebugLogger,
  TodaysHabitsSection,
} from '@/components/habits';
import { useTodaysHabits, useHabitCompletion } from '@/hooks/habits';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(templates);
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

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Debug logger - doesn't render anything */}
      <HabitDebugLogger templates={templates} todaysHabits={todaysHabits} />
      
      <div className="flex items-center gap-4 mb-5">
        <Link 
          to="/"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
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
            todaysHabits={todaysHabits}
            completedHabits={completedHabits}
            onHabitComplete={handleHabitComplete}
            onAddHabitToTasks={handleAddHabitToTasks}
            templateId={todaysHabitsTemplateId}
          />
        )}

        <div className="bg-background">
          {/* Habit tracker - now only shows the template manager */}
          <HabitTracker />
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
