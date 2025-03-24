
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HabitDetail } from '@/types/habits';
import { eventManager } from '@/lib/events/EventManager';
import HabitRow from './HabitRow';
import { cn } from '@/lib/utils';

interface TodaysHabitsSectionProps {
  todaysHabits: HabitDetail[];
  completedHabits: string[];
  dismissedHabits: string[];
  onHabitComplete: (habitId: string) => void;
  onAddHabitToTasks: (habit: HabitDetail) => void;
  templateId?: string;
}

const TodaysHabitsSection: React.FC<TodaysHabitsSectionProps> = ({
  todaysHabits,
  completedHabits,
  dismissedHabits,
  onHabitComplete,
  onAddHabitToTasks,
  templateId
}) => {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  
  // Set up event listeners
  useEffect(() => {
    const handleHabitSelect = (habitId: string) => {
      setSelectedHabit(habitId);
    };
    
    const unsubscribe = eventManager.on('habit:select', handleHabitSelect);
    return unsubscribe;
  }, []);
  
  if (!todaysHabits || todaysHabits.length === 0) {
    return (
      <Card className="shadow-sm h-full flex flex-col justify-center">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No habits scheduled for today</p>
        </CardContent>
      </Card>
    );
  }

  // Filter out dismissed habits
  const activeHabits = todaysHabits.filter(habit => !dismissedHabits.includes(habit.id));
  
  // Group completed vs. pending habits
  const completed = activeHabits.filter(habit => completedHabits.includes(habit.id));
  const pending = activeHabits.filter(habit => !completedHabits.includes(habit.id));
  
  // Completion percentage
  const totalCount = activeHabits.length;
  const completedCount = completed.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          <span>Today's Habits</span>
          <span className={cn(
            "text-sm font-medium px-2 py-0.5 rounded-md",
            completionPercentage === 100 
              ? "bg-green-500/20 text-green-700 dark:text-green-300" 
              : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
          )}>
            {completedCount}/{totalCount} ({completionPercentage}%)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 h-[calc(100%-2rem)]">
          <div className="p-3 space-y-2">
            {/* Pending habits */}
            {pending.map(habit => (
              <HabitRow
                key={habit.id}
                habit={habit}
                isCompleted={false}
                isSelected={selectedHabit === habit.id}
                onComplete={() => onHabitComplete(habit.id)}
                onAddToTasks={() => onAddHabitToTasks(habit)}
                templateId={templateId}
              />
            ))}
            
            {/* Completed habits */}
            {completed.map(habit => (
              <HabitRow
                key={habit.id}
                habit={habit}
                isCompleted={true}
                isSelected={selectedHabit === habit.id}
                onComplete={() => onHabitComplete(habit.id)}
                onAddToTasks={() => onAddHabitToTasks(habit)}
                templateId={templateId}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TodaysHabitsSection;
