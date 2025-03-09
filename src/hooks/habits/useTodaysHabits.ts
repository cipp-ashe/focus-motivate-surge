
import { useEffect, useState, useCallback } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

/**
 * Custom hook to manage today's habits and their task generation
 * Following Single Responsibility Principle - this hook only manages habit scheduling
 */
export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const [lastProcessedTemplates, setLastProcessedTemplates] = useState<string[]>([]);
  
  // Get habits scheduled for today
  const getTodaysHabits = useCallback(() => {
    const today = new Date();
    const dayIndex = today.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[dayIndex] as DayOfWeek;
    
    console.log(`useTodaysHabits - Today is ${dayOfWeek}, checking active templates:`, activeTemplates);
    
    const habits = activeTemplates.flatMap(template => {
      console.log(`Checking template ${template.templateId} - active days:`, template.activeDays);
      const isActiveToday = template.activeDays.includes(dayOfWeek);
      console.log(`Template ${template.templateId} is active today: ${isActiveToday}`);
      
      return isActiveToday ? template.habits : [];
    });
    
    console.log("useTodaysHabits - Today's habits:", habits);
    console.log("useTodaysHabits - Number of habits found for today:", habits.length);
    return habits;
  }, [activeTemplates]);

  // Process today's habits and generate tasks for timer-based habits
  const processHabits = useCallback((habits: HabitDetail[]) => {
    const today = new Date().toDateString();
    console.log('Processing habits for today:', today);
    
    // Track which templates we've processed
    const processedTemplateIds = new Set<string>();
    
    habits.forEach(habit => {
      if (habit.metrics?.type === 'timer') {
        const template = activeTemplates.find(t => 
          t.habits.some(h => h.id === habit.id)
        );
        
        if (template) {
          console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${template.templateId}`);
          processedTemplateIds.add(template.templateId);
          
          // The target is stored in seconds in the habit.metrics.target
          const durationInSeconds = habit.metrics.target || 600; // Default to 10 minutes (600 seconds)
          
          console.log(`Creating task for habit ${habit.name} with duration ${durationInSeconds} seconds (${Math.floor(durationInSeconds / 60)} minutes)`);
          
          // Emit the event to ensure task creation
          eventBus.emit('habit:schedule', {
            habitId: habit.id,
            templateId: template.templateId,
            duration: durationInSeconds,
            name: habit.name,
            date: today
          });
        }
      }
    });
    
    // Find templates that were previously processed but are no longer active
    const currentTemplateIds = Array.from(processedTemplateIds);
    const removedTemplates = lastProcessedTemplates.filter(
      id => !currentTemplateIds.includes(id)
    );
    
    // For removed templates, emit an event to clean up their tasks
    removedTemplates.forEach(templateId => {
      console.log(`Template ${templateId} was removed, cleaning up its tasks`);
      eventBus.emit('habit:template-delete', { templateId });
    });
    
    // Update the list of last processed templates
    setLastProcessedTemplates(currentTemplateIds);
    
    localStorage.setItem('lastHabitProcessingDate', today);
  }, [activeTemplates, lastProcessedTemplates]);

  // Immediate processing when templates change
  useEffect(() => {
    const habits = getTodaysHabits();
    setTodaysHabits(habits);
    
    // Force process habits on first load and every time templates change
    processHabits(habits);
    
    // Also listen for template-add events to immediately process 
    // new templates without requiring a refresh
    const handleTemplateAdd = () => {
      console.log("Template added, immediately processing habits");
      const updatedHabits = getTodaysHabits();
      setTodaysHabits(updatedHabits);
      processHabits(updatedHabits);
    };
    
    const unsubscribe = eventBus.on('habit:template-add', handleTemplateAdd);
    
    return () => {
      unsubscribe();
    };
  }, [getTodaysHabits, processHabits]);

  return { todaysHabits };
};
