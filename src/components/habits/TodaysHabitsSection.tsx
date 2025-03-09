
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { TodaysHabitCard } from '@/components/habits';
import { HabitDetail } from './types';

interface TodaysHabitsSectionProps {
  todaysHabits: HabitDetail[];
  completedHabits: string[];
  onHabitComplete: (habit: HabitDetail, templateId?: string) => void;
  onAddHabitToTasks?: (habit: HabitDetail) => void;
  templateId?: string;
  className?: string;
}

const TodaysHabitsSection: React.FC<TodaysHabitsSectionProps> = ({
  todaysHabits,
  completedHabits,
  onHabitComplete,
  onAddHabitToTasks,
  templateId,
  className
}) => {
  const isMobile = useIsMobile();

  // Don't render anything if there are no habits for today
  if (!todaysHabits || todaysHabits.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      isMobile ? 'order-first' : 'lg:order-last',
      "bg-card/50 border border-border rounded-lg shadow-sm overflow-hidden",
      className
    )}>
      <TodaysHabitCard
        habits={todaysHabits}
        completedHabits={completedHabits}
        onHabitComplete={onHabitComplete}
        onAddHabitToTasks={onAddHabitToTasks}
        templateId={templateId}
      />
    </div>
  );
};

export default TodaysHabitsSection;
