
import { useState, useCallback, useEffect } from 'react';
import { HabitDetail } from '@/components/habits/types';
import { ActiveTemplate } from '@/components/habits/types';
import { useHabitRelationships } from './useHabitRelationships';
import { habitTaskOperations } from '@/lib/operations/tasks/habit';
import { eventManager } from '@/lib/events/EventManager';
import { toast } from 'sonner';

export const useHabitCompletion = (todaysHabits: HabitDetail[], templates: ActiveTemplate[]) => {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [dismissedHabits, setDismissedHabits] = useState<string[]>([]);
  const { getRelatedTasks } = useHabitRelationships();
  
  // Load completion status on mount
  useEffect(() => {
    // Load from stored progress
    try {
      const progressMap = JSON.parse(localStorage.getItem('habit-progress') || '{}');
      const today = new Date().toISOString().split('T')[0];
      
      const completed: string[] = [];
      const dismissed: string[] = [];
      
      // Process each template's habits
      Object.keys(progressMap).forEach(templateId => {
        const templateData = progressMap[templateId];
        
        Object.keys(templateData).forEach(habitId => {
          const habitData = templateData[habitId];
          
          // Check today's status
          if (habitData[today]) {
            if (habitData[today].completed) {
              completed.push(habitId);
            }
            
            if (habitData[today].dismissed) {
              dismissed.push(habitId);
            }
          }
        });
      });
      
      setCompletedHabits(completed);
      setDismissedHabits(dismissed);
      
    } catch (error) {
      console.error('Error loading habit completion status:', error);
    }
  }, []);
  
  // Mark a habit as complete
  const completeHabit = useCallback((habitId: string, templateId: string): boolean => {
    // Update UI state
    setCompletedHabits(prev => {
      if (!prev.includes(habitId)) {
        return [...prev, habitId];
      }
      return prev;
    });
    
    // Update storage
    try {
      const progressMap = JSON.parse(localStorage.getItem('habit-progress') || '{}');
      const today = new Date().toISOString().split('T')[0];
      
      // Initialize nested structure if needed
      if (!progressMap[templateId]) {
        progressMap[templateId] = {};
      }
      
      if (!progressMap[templateId][habitId]) {
        progressMap[templateId][habitId] = {};
      }
      
      // Get previous streak or start at 0
      const prevStreak = progressMap[templateId][habitId][today]?.streak || 0;
      
      // Update for today
      progressMap[templateId][habitId][today] = {
        value: true,
        streak: prevStreak + 1,
        date: today,
        completed: true,
        dismissed: false
      };
      
      // Save back to storage
      localStorage.setItem('habit-progress', JSON.stringify(progressMap));
      
      // Update related tasks
      const tasks = getRelatedTasks(habitId);
      if (tasks.length > 0) {
        tasks.forEach(task => {
          if (habitTaskOperations.completeTask) {
            habitTaskOperations.completeTask(task.id);
          }
        });
      }
      
      // Emit event for other components
      eventManager.emit('habit:complete', { 
        habitId, 
        completed: true, 
        date: today 
      });
      
      return true;
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to update habit progress');
      return false;
    }
  }, [getRelatedTasks]);
  
  // Mark a habit as dismissed
  const dismissHabit = useCallback((habitId: string, templateId: string): boolean => {
    // Update UI state
    setDismissedHabits(prev => {
      if (!prev.includes(habitId)) {
        return [...prev, habitId];
      }
      return prev;
    });
    
    // Update storage
    try {
      const progressMap = JSON.parse(localStorage.getItem('habit-progress') || '{}');
      const today = new Date().toISOString().split('T')[0];
      
      // Initialize nested structure if needed
      if (!progressMap[templateId]) {
        progressMap[templateId] = {};
      }
      
      if (!progressMap[templateId][habitId]) {
        progressMap[templateId][habitId] = {};
      }
      
      // Update for today
      progressMap[templateId][habitId][today] = {
        ...progressMap[templateId][habitId][today],
        dismissed: true
      };
      
      // Save back to storage
      localStorage.setItem('habit-progress', JSON.stringify(progressMap));
      
      // Emit event for other components
      eventManager.emit('habit:dismissed', { 
        habitId,
        date: today 
      });
      
      return true;
    } catch (error) {
      console.error('Error dismissing habit:', error);
      toast.error('Failed to dismiss habit');
      return false;
    }
  }, []);
  
  // Check if a habit is completed
  const isHabitCompleted = useCallback((habitId: string) => {
    return completedHabits.includes(habitId);
  }, [completedHabits]);
  
  // Check if a habit is dismissed
  const isHabitDismissed = useCallback((habitId: string) => {
    return dismissedHabits.includes(habitId);
  }, [dismissedHabits]);
  
  // Function for UI to handle habit completion
  const handleHabitComplete = useCallback((habitId: string, completed: boolean) => {
    // Find the habit object
    const habit = todaysHabits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Find the template for this habit
    const template = templates.find(t => 
      t.habits.some(h => h.id === habitId)
    );
    
    if (!template) {
      console.error("Could not find template for habit:", habitId);
      toast.error("Error marking habit as complete");
      return;
    }

    if (completed) {
      completeHabit(habitId, template.templateId);
    } else {
      // Handle unchecking a habit if needed
      setCompletedHabits(prev => prev.filter(id => id !== habitId));
    }
  }, [completeHabit, todaysHabits, templates]);
  
  // Function to add a habit as a task
  const handleAddHabitToTasks = useCallback((habit: HabitDetail) => {
    // Only timer-based habits can be added as tasks
    if (habit.metrics.type !== 'timer') {
      toast.error("Only timer-based habits can be added as tasks");
      return;
    }
    
    // Find template for this habit
    const template = templates.find(t => 
      t.habits.some(h => h.id === habit.id)
    );
    
    if (!template) {
      toast.error("Could not find template for habit");
      return;
    }
    
    // Create a new task for this habit
    const today = new Date().toDateString();
    const taskId = crypto.randomUUID();
    const duration = habit.metrics.target || 1500; // Default to 25 minutes if no target set
    
    const task = {
      id: taskId,
      name: habit.name,
      description: habit.description,
      completed: false,
      duration,
      createdAt: new Date().toISOString(),
      relationships: {
        habitId: habit.id,
        templateId: template.templateId,
        date: today
      }
    };
    
    // Create the task via eventManager
    eventManager.emit('task:create', task);
    
    // Add the Habit tag
    eventManager.emit('tag:link', {
      tagId: 'Habit',
      entityId: taskId,
      entityType: 'task'
    });
    
    // Select the task and start the timer
    eventManager.emit('task:select', taskId);
    
    // Send timer events
    setTimeout(() => {
      eventManager.emit('timer:start', { 
        taskName: task.name, 
        duration: task.duration
      });
      
      // Expand timer view
      eventManager.emit('timer:expand', { taskName: task.name });
    }, 100);
    
    toast.success(`Added "${habit.name}" to tasks and started timer`);
  }, [templates]);

  return {
    completedHabits,
    dismissedHabits,
    completeHabit,
    dismissHabit,
    isHabitCompleted,
    isHabitDismissed,
    handleHabitComplete,
    handleAddHabitToTasks
  };
};
