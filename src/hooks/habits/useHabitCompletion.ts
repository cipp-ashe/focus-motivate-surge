
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
  const completeHabit = useCallback((habitId: string, templateId: string) => {
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
          habitTaskOperations.completeTask(task.id);
        });
      }
      
      // Emit event for other components
      eventManager.emit('habit:complete', { 
        habitId, 
        templateId, 
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
  const dismissHabit = useCallback((habitId: string, templateId: string) => {
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
        templateId, 
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
  
  return {
    completeHabit,
    dismissHabit,
    isHabitCompleted,
    isHabitDismissed,
    completedHabits,
    dismissedHabits
  };
};
