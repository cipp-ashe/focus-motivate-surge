
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
  const pendingProcessingRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get habits scheduled for today
  const getTodaysHabits = useCallback(() => {
    const today = new Date();
    const dayIndex = today.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = daysOfWeek[dayIndex] as DayOfWeek;
    
    if (activeTemplates.length === 0) {
      console.log(`useTodaysHabits - No active templates, returning empty habits list`);
      return [];
    }
    
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
    // Clear any pending processing
    if (pendingProcessingRef.current) {
      clearTimeout(pendingProcessingRef.current);
      pendingProcessingRef.current = null;
    }
    
    if (processingRef.current) {
      console.log("Already processing habits, scheduling for later");
      pendingProcessingRef.current = setTimeout(() => {
        processHabits(habits);
      }, 500);
      return;
    }
    
    processingRef.current = true;
    
    try {
      const today = new Date().toDateString();
      console.log('Processing habits for today:', today);
      
      // Special case for empty habits - clear out tracking data
      if (habits.length === 0 || activeTemplates.length === 0) {
        console.log("No habits or templates to process, clearing today's habits");
        setTodaysHabits([]);
        processingRef.current = false;
        return;
      }
      
      // Calculate a signature from activeTemplates to detect changes
      const currentTemplateSignature = JSON.stringify(
        activeTemplates.map(t => t.templateId).sort()
      );
      
      // Only process once per day per template signature unless forced
      if (lastProcessedDateRef.current === today && 
          activeTemplatesSignatureRef.current === currentTemplateSignature &&
          initialProcessingCompleteRef.current &&
          habits.length > 0) {
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
            
            // Add a small delay to ensure the template is fully registered
            setTimeout(() => {
              // Emit the event to ensure task creation
              eventBus.emit('habit:schedule', {
                habitId: habit.id,
                templateId: templateId,
                duration: durationInSeconds,
                name: habit.name,
                date: today
              });
            }, 300);
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
      // Release the processing lock after a delay to prevent race conditions
      setTimeout(() => {
        processingRef.current = false;
        
        // Check for pending processing
        if (pendingProcessingRef.current) {
          clearTimeout(pendingProcessingRef.current);
          pendingProcessingRef.current = null;
          
          // Get fresh habits
          const freshHabits = getTodaysHabits();
          processHabits(freshHabits);
        }
      }, 300);
    }
  }, [activeTemplates, lastProcessedTemplateIds, getTodaysHabits]);

  // Handle template changes and process habits
  useEffect(() => {
    // Don't process if there are no active templates
    if (activeTemplates.length === 0) {
      // Clear today's habits when no active templates exist
      setTodaysHabits([]);
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
      
      // Use a delay to ensure consistency
      const timeoutId = setTimeout(() => {
        processHabits(habits);
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeTemplates, getTodaysHabits, processHabits]);
  
  // Listen for template deletion events to update today's habits
  useEffect(() => {
    const handleTemplateDelete = ({ templateId }: { templateId: string }) => {
      console.log(`useTodaysHabits - Template deleted: ${templateId}`);
      
      // Clear processed flag for this template
      const today = new Date().toDateString();
      if (processedTemplatesMapRef.current.has(today)) {
        // Find and remove all habits from this template
        const habitsToRemove = new Set<string>();
        activeTemplates
          .filter(t => t.templateId === templateId)
          .forEach(template => {
            template.habits.forEach(habit => {
              habitsToRemove.add(habit.id);
            });
          });
          
        // Remove these habits from processed list  
        const processedSet = processedTemplatesMapRef.current.get(today)!;
        habitsToRemove.forEach(habitId => {
          processedSet.delete(habitId);
        });
      }
      
      // Update today's habits by filtering out habits from the deleted template
      setTodaysHabits(prev => {
        // Find which habits belong to the deleted template
        const habitsToRemove = activeTemplates
          .filter(t => t.templateId === templateId)
          .flatMap(t => t.habits.map(h => h.id));
          
        // Filter out those habits
        const updatedHabits = prev.filter(habit => !habitsToRemove.includes(habit.id));
        console.log(`useTodaysHabits - Filtered out ${prev.length - updatedHabits.length} habits from deleted template`);
        
        return updatedHabits;
      });
      
      // Force an update of the template signature to trigger reprocessing
      activeTemplatesSignatureRef.current = "";
    };
    
    const unsubscribeDelete = eventBus.on('habit:template-delete', handleTemplateDelete);
    
    return () => {
      unsubscribeDelete();
    };
  }, [activeTemplates]);
  
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
        // We need to delay processing to ensure the template state has been updated
        console.log("Template added, scheduling processing after state update");
        
        // Wait for next tick to allow state updates to propagate
        setTimeout(() => {
          const updatedHabits = getTodaysHabits();
          setTodaysHabits(updatedHabits);
          
          // Force refresh of template signature
          activeTemplatesSignatureRef.current = "";
          
          // Then process with a small delay
          setTimeout(() => {
            processHabits(updatedHabits);
          }, 300);
        }, 500);
      } finally {
        // Clear the flag only after a longer delay to prevent race conditions
        setTimeout(() => {
          templateAddInProgressRef.current = false;
        }, 1000);
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
      if (pendingProcessingRef.current) {
        clearTimeout(pendingProcessingRef.current);
      }
    };
  }, [getTodaysHabits, processHabits, lastProcessedTemplateIds]);

  return { todaysHabits };
};
