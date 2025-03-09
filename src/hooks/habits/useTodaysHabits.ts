
import { useEffect, useState, useCallback, useRef } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

/**
 * Custom hook to manage today's habits and their task generation
 * Following Single Responsibility Principle - this hook only manages habit scheduling
 */
export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const [lastProcessedTemplateIds, setLastProcessedTemplateIds] = useState<string[]>([]);
  const processingRef = useRef(false);
  const templateAddInProgressRef = useRef(false);
  
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
    if (processingRef.current) return;
    processingRef.current = true;
    
    try {
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
      const removedTemplates = lastProcessedTemplateIds.filter(
        id => !currentTemplateIds.includes(id)
      );
      
      // For removed templates, emit an event to clean up their tasks
      removedTemplates.forEach(templateId => {
        console.log(`Template ${templateId} was removed, cleaning up its tasks`);
        eventBus.emit('habit:template-delete', { templateId });
      });
      
      // Update the list of last processed templates
      setLastProcessedTemplateIds(currentTemplateIds);
      
      localStorage.setItem('lastHabitProcessingDate', today);
    } finally {
      processingRef.current = false;
    }
  }, [activeTemplates, lastProcessedTemplateIds]);

  // Handle template changes and process habits
  useEffect(() => {
    // Add check to prevent reprocessing if templates haven't changed
    const currentTemplateIds = activeTemplates.map(t => t.templateId).sort().join(',');
    const prevTemplateIds = lastProcessedTemplateIds.sort().join(',');
    
    // Only update if templates have changed and we're not already processing
    if (currentTemplateIds !== prevTemplateIds && !processingRef.current) {
      const habits = getTodaysHabits();
      setTodaysHabits(habits);
      
      // Process habits when templates actually change
      processHabits(habits);
    }
  }, [activeTemplates, getTodaysHabits, processHabits, lastProcessedTemplateIds]);
  
  // Handle template-add events - separate from the main effect to avoid circular dependencies
  useEffect(() => {
    const handleTemplateAdd = (templateId: string) => {
      console.log(`Event received: habit:template-add ${templateId}`);
      
      // Prevent duplicate processing with a ref
      if (templateAddInProgressRef.current) {
        console.log("Template add already in progress, skipping duplicate event");
        return;
      }
      
      // Check if we've already processed this template
      if (lastProcessedTemplateIds.includes(templateId)) {
        console.log(`Template ${templateId} already processed, skipping`);
        return;
      }
      
      templateAddInProgressRef.current = true;
      
      try {
        console.log("Template added, immediately processing habits");
        const updatedHabits = getTodaysHabits();
        setTodaysHabits(updatedHabits);
        processHabits(updatedHabits);
      } finally {
        // Clear the flag only after a short delay to prevent race conditions
        setTimeout(() => {
          templateAddInProgressRef.current = false;
        }, 100);
      }
    };
    
    const unsubscribe = eventBus.on('habit:template-add', handleTemplateAdd);
    
    return () => {
      unsubscribe();
    };
  }, [getTodaysHabits, processHabits, lastProcessedTemplateIds]);

  return { todaysHabits };
};
