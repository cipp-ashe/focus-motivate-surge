
import { useState, useEffect, useCallback } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import { HabitDetail } from '@/components/habits/types';
import { useLocation } from 'react-router-dom';

export const useTodaysHabits = () => {
  const { templates } = useHabitState();
  const [todaysHabits, setTodaysHabits] = useState<HabitDetail[]>([]);
  const location = useLocation();

  const getTodayShortName = useCallback((): string => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = new Date().getDay();
    return dayNames[day];
  }, []);

  const refreshHabits = useCallback(() => {
    const todayShortName = getTodayShortName();
    
    // Get all habits from templates active today
    const habits: HabitDetail[] = [];
    
    templates.forEach(template => {
      if (template.activeDays.includes(todayShortName)) {
        template.habits.forEach(habit => {
          // Add templateId to habit for reference
          const habitWithTemplate = {
            ...habit,
            relationships: {
              ...(habit.relationships || {}),
              templateId: template.templateId
            }
          };
          habits.push(habitWithTemplate);
        });
      }
    });
    
    setTodaysHabits(habits);
  }, [templates, getTodayShortName]);

  // Refresh habits when templates change or route changes
  useEffect(() => {
    refreshHabits();
  }, [templates, location.pathname, refreshHabits]);

  // Listen for force-habits-update event
  useEffect(() => {
    const handleForceUpdate = () => {
      refreshHabits();
    };

    window.addEventListener('force-habits-update', handleForceUpdate);
    return () => {
      window.removeEventListener('force-habits-update', handleForceUpdate);
    };
  }, [refreshHabits]);

  return { todaysHabits, refreshHabits };
};
