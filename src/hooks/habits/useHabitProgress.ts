
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { eventBus } from '@/lib/eventBus';

interface HabitProgressResult {
  value: boolean | number;
  streak: number;
  completed: boolean;
}

export const useHabitProgress = () => {
  const [progressMap, setProgressMap] = useState<Record<string, Record<string, Record<string, any>>>>({});
  
  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('habit-progress');
      if (stored) {
        setProgressMap(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading habit progress:', error);
      toast.error('Error loading habit progress');
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(progressMap).length > 0) {
      localStorage.setItem('habit-progress', JSON.stringify(progressMap));
    }
  }, [progressMap]);

  // Listen for events that might need to update habit progress
  useEffect(() => {
    const handleJournalComplete = ({ habitId, templateId }: { habitId: string, templateId: string }) => {
      updateProgress(habitId, templateId, true);
    };
    
    const handleJournalDeleted = ({ habitId, templateId }: { habitId: string, templateId: string }) => {
      updateProgress(habitId, templateId, false);
    };
    
    const handleTemplateDeleted = ({ templateId }: { templateId: string }) => {
      // Remove all progress for this template
      setProgressMap(prev => {
        const updated = { ...prev };
        delete updated[templateId];
        return updated;
      });
    };
    
    // Subscribe to relevant events
    const unsubJournalComplete = eventBus.on('habit:journal-complete', handleJournalComplete);
    const unsubJournalDeleted = eventBus.on('habit:journal-deleted', handleJournalDeleted);
    const unsubTemplateDeleted = eventBus.on('habit:template-delete', handleTemplateDeleted);
    
    return () => {
      unsubJournalComplete();
      unsubJournalDeleted();
      unsubTemplateDeleted();
    };
  }, []);

  // Get progress for a specific habit on today's date
  const getTodayProgress = useCallback((habitId: string, templateId: string): HabitProgressResult => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!progressMap[templateId] || !progressMap[templateId][habitId] || !progressMap[templateId][habitId][today]) {
      return { value: false, streak: 0, completed: false };
    }
    
    return progressMap[templateId][habitId][today];
  }, [progressMap]);

  // Update progress for a specific habit
  const updateProgress = useCallback((habitId: string, templateId: string, value: boolean | number) => {
    const today = new Date().toISOString().split('T')[0];
    
    const currentProgress = getTodayProgress(habitId, templateId);
    const streak = value && !currentProgress.value ? (currentProgress.streak || 0) + 1 : currentProgress.streak || 0;
    
    setProgressMap(prev => {
      const updated = { ...prev };
      if (!updated[templateId]) updated[templateId] = {};
      if (!updated[templateId][habitId]) updated[templateId][habitId] = {};
      
      updated[templateId][habitId][today] = {
        value,
        streak,
        date: today,
        completed: !!value
      };
      
      return updated;
    });
    
    // Emit event for other components to react to
    eventBus.emit('habit:progress-update', { habitId, templateId, value, date: today });
    
    return { value, streak, completed: !!value };
  }, [getTodayProgress]);

  return {
    getTodayProgress,
    updateProgress
  };
};
