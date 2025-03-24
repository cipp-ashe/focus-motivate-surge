
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TodaysHabitCard from './TodaysHabitCard';
import { HabitDetail } from '@/types/habits/types';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';
import { getTodaysHabits } from '@/utils/habitUtils';

interface TodaysHabitsSectionProps {
  templates: any[];
  date?: Date;
}

export const TodaysHabitsSection: React.FC<TodaysHabitsSectionProps> = ({ 
  templates,
  date = new Date()
}) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({});
  
  // Get today's habits from templates
  useEffect(() => {
    if (templates && templates.length > 0) {
      const habits = getTodaysHabits(templates, date);
      setTodaysHabits(habits);
      console.log('Today\'s habits:', habits);
    }
  }, [templates, date]);
  
  // Mark habit as complete
  const handleCompleteHabit = useCallback((habit: HabitDetail) => {
    // Find the template this habit belongs to
    const templateId = habit.relationships?.templateId;
    
    // Mark as complete locally
    setCompletedHabits(prev => ({
      ...prev,
      [habit.id]: !prev[habit.id]
    }));
    
    // Emit habit completion event
    const dateStr = date.toISOString().split('T')[0];
    eventManager.emit('habit:complete', {
      habitId: habit.id,
      date: dateStr,
      value: true,
      metricType: habit.metrics.type,
      habitName: habit.name,
      templateId
    });
    
    // Show toast
    if (!completedHabits[habit.id]) {
      toast.success(`Marked "${habit.name}" as complete`);
    } else {
      toast.info(`Marked "${habit.name}" as incomplete`);
    }
  }, [completedHabits, date]);
  
  // Add habit to tasks
  const handleAddToTasks = useCallback((habit: HabitDetail) => {
    // Find the template this habit belongs to
    const templateId = habit.relationships?.templateId;
    
    if (!templateId) {
      toast.error('Missing template information');
      return;
    }
    
    const dateStr = date.toISOString().split('T')[0];
    
    // For journal habits, open the journal
    if (habit.metrics.type === 'journal') {
      eventManager.emit('journal:open', {
        habitId: habit.id,
        habitName: habit.name,
        templateId,
        description: habit.description,
        date: dateStr
      });
      return;
    }
    
    // For other habit types, schedule a task
    let duration = 0;
    if (habit.metrics.type === 'timer' && habit.metrics.goal) {
      duration = habit.metrics.goal;
    } else {
      // Default duration (25 minutes)
      duration = 25 * 60;
    }
    
    // Emit event to schedule the habit task
    eventManager.emit('habit:schedule', {
      habitId: habit.id,
      templateId,
      name: habit.name,
      duration,
      date: dateStr,
      metricType: habit.metrics.type
    });
    
    toast.success(`Added "${habit.name}" to your tasks`);
  }, [date]);
  
  // No habits case
  if (todaysHabits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No habits scheduled for today</p>
            <Button variant="outline" className="mt-4">Add Habit Template</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaysHabits.map(habit => (
            <TodaysHabitCard
              key={habit.id}
              habit={habit}
              isCompleted={!!completedHabits[habit.id]}
              onComplete={() => handleCompleteHabit(habit)}
              onAddToTasks={() => handleAddToTasks(habit)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysHabitsSection;
