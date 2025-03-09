
import { useEffect, useState, useCallback, useRef } from 'react';
import { HabitDetail, DayOfWeek, ActiveTemplate } from '@/components/habits/types';
import { eventBus } from '@/lib/eventBus';

export const useTodaysHabits = (activeTemplates: ActiveTemplate[]) => {
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const processingRef = useRef(false);
  const initialProcessingCompleteRef = useRef(false);
  const lastProcessedDateRef = useRef<string | null>(null);
  const activeTemplatesSignatureRef = useRef<string>("");
  const pendingProcessingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get the current day of week
  const getCurrentDayOfWeek = useCallback((): DayOfWeek => {
    const today = new Date();
    const dayIndex = today.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek[dayIndex] as DayOfWeek;
  }, []);
  
  // Create a signature for the active templates to detect changes
  const getActiveTemplatesSignature = useCallback((templates: ActiveTemplate[]): string => {
    return templates.map(t => `${t.templateId}-${t.customized}`).join('|');
  }, []);
  
  // Get habits scheduled for today
  const getTodaysHabits = useCallback(() => {
    if (activeTemplates.length === 0) {
      console.log(`useTodaysHabits - No active templates, returning empty habits list`);
      return [];
    }
    
    const dayOfWeek = getCurrentDayOfWeek();
    const today = new Date().toDateString();
    
    console.log(`useTodaysHabits - Today is ${dayOfWeek}, checking active templates:`, activeTemplates);
    
    // Find habits for templates active today
    const habits = activeTemplates.flatMap(template => {
      console.log(`Checking template ${template.templateId} - active days:`, template.activeDays);
      const isActiveToday = template.activeDays.includes(dayOfWeek);
      console.log(`Template ${template.templateId} is active today: ${isActiveToday}`);
      
      if (isActiveToday) {
        // Return all habits in the template with a processing flag
        return template.habits.map(habit => ({
          ...habit,
          // Add a reference to the template ID for easier tracking
          _templateId: template.templateId
        }));
      }
      
      return [];
    });
    
    console.log("useTodaysHabits - Today's habits:", habits);
    console.log("useTodaysHabits - Number of habits found for today:", habits.length);
    
    // Process habits (create tasks for timer habits, etc)
    if (habits.length > 0) {
      processHabits(habits, today);
    }
    
    return habits;
  }, [activeTemplates, getCurrentDayOfWeek]);
  
  // Process habits (e.g., create tasks for timer habits)
  const processHabits = useCallback((habits: HabitDetail[], date: string) => {
    console.log(`Processing habits for today: ${date}`);
    
    if (habits.length === 0) {
      console.log("No habits or templates to process, clearing today's habits");
      return;
    }
    
    // Schedule timer-based habits as tasks
    habits.forEach(habit => {
      if (habit.metrics.type === 'timer') {
        const templateId = (habit as any)._templateId;
        if (!templateId) return;
        
        console.log(`Scheduling timer habit: ${habit.name} (${habit.id}) from template ${templateId}`);
        const duration = habit.metrics.target || 600; // Default to 10 minutes
        
        console.log(`Creating task for habit ${habit.name} with duration ${duration} seconds (${Math.floor(duration / 60)} minutes)`);
        
        // Use event bus to schedule this habit
        eventBus.emit('habit:schedule', {
          habitId: habit.id,
          templateId,
          duration,
          name: habit.name,
          date
        });
      }
    });
  }, []);
  
  // Process templates whenever they change
  useEffect(() => {
    const newSignature = getActiveTemplatesSignature(activeTemplates);
    
    // Skip if nothing has changed and we've already processed
    if (newSignature === activeTemplatesSignatureRef.current && initialProcessingCompleteRef.current) {
      return;
    }
    
    // Update ref for future comparisons
    activeTemplatesSignatureRef.current = newSignature;
    
    // Cancel any pending processing
    if (pendingProcessingTimeoutRef.current) {
      clearTimeout(pendingProcessingTimeoutRef.current);
    }
    
    // Skip if we're already processing
    if (processingRef.current) {
      console.log("Already processing habits, scheduling for later");
      pendingProcessingTimeoutRef.current = setTimeout(() => {
        const habits = getTodaysHabits();
        setTodaysHabits(habits);
        initialProcessingCompleteRef.current = true;
      }, 100);
      return;
    }
    
    // Process habits
    processingRef.current = true;
    try {
      const habits = getTodaysHabits();
      setTodaysHabits(habits);
      initialProcessingCompleteRef.current = true;
    } finally {
      processingRef.current = false;
    }
  }, [activeTemplates, getTodaysHabits, getActiveTemplatesSignature]);
  
  // Set up event listeners for force updates
  useEffect(() => {
    const handleForceUpdate = () => {
      console.log("Force updating today's habits");
      const habits = getTodaysHabits();
      setTodaysHabits(habits);
    };
    
    // Listen for template changes
    const onTemplateUpdate = () => {
      console.log("Template updated, refreshing today's habits");
      const habits = getTodaysHabits();
      setTodaysHabits(habits);
    };
    
    const onTemplateDelete = ({ templateId }: { templateId: string }) => {
      console.log(`Template ${templateId} deleted, removing its habits from today's list`);
      setTodaysHabits(prev => prev.filter(habit => (habit as any)._templateId !== templateId));
    };
    
    window.addEventListener('force-habits-update', handleForceUpdate);
    const unsubUpdate = eventBus.on('habit:template-update', onTemplateUpdate);
    const unsubDelete = eventBus.on('habit:template-delete', onTemplateDelete);
    
    // Clean up
    return () => {
      window.removeEventListener('force-habits-update', handleForceUpdate);
      unsubUpdate();
      unsubDelete();
      
      if (pendingProcessingTimeoutRef.current) {
        clearTimeout(pendingProcessingTimeoutRef.current);
      }
    };
  }, [getTodaysHabits]);
  
  // Reset processing at midnight
  useEffect(() => {
    const setupMidnightReset = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        console.log("Midnight reset for today's habits");
        lastProcessedDateRef.current = null;
        initialProcessingCompleteRef.current = false;
        
        // Process habits for the new day
        const habits = getTodaysHabits();
        setTodaysHabits(habits);
        
        // Set up next reset
        setupMidnightReset();
      }, timeUntilMidnight);
    };
    
    setupMidnightReset();
    
    // Clean up
    return () => {
      // Any cleanup needed
    };
  }, [getTodaysHabits]);

  return {
    todaysHabits,
    getTodaysHabits,
  };
};
