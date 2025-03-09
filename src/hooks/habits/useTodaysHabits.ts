
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
  const lastProcessedDateRef = useRef<string | null>(null);
  const processedTemplatesMapRef = useRef(new Map<string, Set<string>>());
  const initialProcessingCompleteRef = useRef(false);
  const activeTemplatesSignatureRef = useRef<string>("");
  
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
    if (processingRef.current) {
      console.log("Already processing habits, skipping duplicate processing");
      return;
    }
    
    processingRef.current = true;
    
    try {
      const today = new Date().toDateString();
      console.log('Processing habits for today:', today);
      
      // Calculate a signature from activeTemplates to detect changes
      const currentTemplateSignature = JSON.stringify(
        activeTemplates.map(t => t.templateId).sort()
      );
      
      // Only process once per day per template signature unless forced
      if (lastProcessedDateRef.current === today && 
          activeTemplatesSignatureRef.current === currentTemplateSignature &&
          initialProcessingCompleteRef.current) {
        console.log("Already processed habits for today with the same templates, skipping");
        processingRef.current = false;
        return;
      }
      
      // Update the template signature
      activeTemplatesSignatureRef.current = currentTemplateSignature;
      
      // Track which templates we've processed
      const processedTemplateIds = new Set<string>();
      
      habits.forEach(habit => {
        if (habit.metrics?.type === 'timer') {
          const template = activeTemplates.find(t => 
            t.habits.some(h => h.id === habit.id)
          );
          
          if (template) {
            const templateId = template.templateId;
            
            // Check if we've already processed this habit for today
            if (!processedTemplatesMapRef.current.has(today)) {
              processedTemplatesMapRef.current.set(today, new Set());
            }
            
            const processedHabitsForToday = processedTemplatesMapRef.current.get(today);
            if (processedHabitsForToday?.has(habit.id)) {
              console.log(`Already processed habit ${habit.id} (${habit.name}) for today, skipping`);
              return;
            }
            
            console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${templateId}`);
            processedTemplateIds.add(templateId);
            processedHabitsForToday?.add(habit.id);
            
            // The target is stored in seconds in the habit.metrics.target
            const durationInSeconds = habit.metrics.target || 600; // Default to 10 minutes (600 seconds)
            
            console.log(`Creating task for habit ${habit.name} with duration ${durationInSeconds} seconds (${Math.floor(durationInSeconds / 60)} minutes)`);
            
            // Emit the event to ensure task creation
            eventBus.emit('habit:schedule', {
              habitId: habit.id,
              templateId: templateId,
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
      lastProcessedDateRef.current = today;
      initialProcessingCompleteRef.current = true;
      
      localStorage.setItem('lastHabitProcessingDate', today);
    } finally {
      processingRef.current = false;
    }
  }, [activeTemplates, lastProcessedTemplateIds]);

  // Handle template changes and process habits
  useEffect(() => {
    // Don't process if no templates or if already processing
    if (activeTemplates.length === 0) {
      return;
    }
    
    // Calculate a signature from activeTemplates to detect changes
    const currentTemplateSignature = JSON.stringify(
      activeTemplates.map(t => t.templateId).sort()
    );
    
    // Only update if templates have changed or if first run
    if (currentTemplateSignature !== activeTemplatesSignatureRef.current || !initialProcessingCompleteRef.current) {
      const habits = getTodaysHabits();
      setTodaysHabits(habits);
      
      // Use a short timeout to ensure we don't process multiple times during mount
      const timeoutId = setTimeout(() => {
        processHabits(habits);
      }, 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeTemplates, getTodaysHabits, processHabits]);
  
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
        
        // Use a short timeout to prevent duplicate processing
        setTimeout(() => {
          processHabits(updatedHabits);
        }, 50);
      } finally {
        // Clear the flag only after a short delay to prevent race conditions
        setTimeout(() => {
          templateAddInProgressRef.current = false;
        }, 100);
      }
    };
    
    // Reset processed templates when day changes
    const resetProcessedTemplatesAtMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log("Resetting processed templates for the new day");
        processedTemplatesMapRef.current.clear();
        lastProcessedDateRef.current = null;
        initialProcessingCompleteRef.current = false;
        setupResetTimer();
      }, timeUntilMidnight);
    };
    
    const setupResetTimer = () => {
      resetProcessedTemplatesAtMidnight();
    };
    
    setupResetTimer();
    
    const unsubscribe = eventBus.on('habit:template-add', handleTemplateAdd);
    
    return () => {
      unsubscribe();
    };
  }, [getTodaysHabits, processHabits, lastProcessedTemplateIds]);

  return { todaysHabits };
};
