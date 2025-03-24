
/**
 * Calculation Utilities
 * Collection of calculation utility functions
 */

import { HabitLog } from '@/types/habit';
import { isSameDay, differenceInDays, parseISO } from 'date-fns';

/**
 * Determines the completion status based on planned vs actual duration
 * @param plannedDuration Planned duration in seconds
 * @param actualDuration Actual duration in seconds
 * @returns Completion status string
 */
export const determineCompletionStatus = (plannedDuration: number, actualDuration: number): string => {
  if (!plannedDuration || !actualDuration) return "Completed";
  
  // If completed in less than 95% of the planned time
  if (actualDuration < plannedDuration * 0.95) {
    return "Completed Early";
  }
  
  // If completed within 5% of the planned time
  if (actualDuration <= plannedDuration * 1.05) {
    return "Completed On Time";
  }
  
  // If completed in more than 105% of the planned time
  return "Completed Late";
};

/**
 * Calculates the efficiency ratio
 * @param plannedDuration Planned duration in seconds
 * @param actualDuration Actual duration in seconds
 * @returns Efficiency ratio (planned/actual)
 */
export const calculateEfficiencyRatio = (plannedDuration: number, actualDuration: number): number => {
  if (!plannedDuration || !actualDuration) return 1;
  
  return plannedDuration / actualDuration;
};

/**
 * Computes the current streak for a habit based on its logs
 * @param logs Array of habit logs
 * @returns The current streak count
 */
export const computeHabitStreak = (logs: HabitLog[]): number => {
  if (!logs || logs.length === 0) return 0;
  
  // Sort logs by date in descending order (newest first)
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Filter to only completed logs
  const completedLogs = sortedLogs.filter(log => log.completed);
  if (completedLogs.length === 0) return 0;
  
  let streak = 1;
  let currentDate = new Date(completedLogs[0].date);
  
  // Check if most recent log is from today or yesterday
  const today = new Date();
  const dayDiff = differenceInDays(today, currentDate);
  if (dayDiff > 1) return 0; // Streak broken if most recent completion is older than yesterday
  
  // Count consecutive days
  for (let i = 1; i < completedLogs.length; i++) {
    const prevDate = new Date(completedLogs[i].date);
    const diffDays = differenceInDays(currentDate, prevDate);
    
    if (diffDays === 1) {
      // Consecutive day
      streak++;
      currentDate = prevDate;
    } else if (diffDays > 1) {
      // Break in streak
      break;
    }
    // If diffDays === 0, it's the same day, so we don't count it again
  }
  
  return streak;
};
