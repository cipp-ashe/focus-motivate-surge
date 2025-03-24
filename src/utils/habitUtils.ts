/**
 * Habit Utility Functions
 */
import { HabitDetail, DayOfWeek, SHORT_DAYS } from '@/types/habit';

/**
 * Gets the list of habits that should be active today
 */
export const getTodaysHabits = (templates: any[], date: Date = new Date()): HabitDetail[] => {
  // Get the current day of the week as a short day name
  const dayOfWeek = date.getDay();
  const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = days[dayOfWeek];

  // Collect all habits from templates that are active today
  const todaysHabits: HabitDetail[] = [];

  templates.forEach((template) => {
    // Skip if template has no activeDays property or the template is not active today
    if (!template.activeDays || !template.activeDays.includes(todayName)) {
      return;
    }

    // Add relationship info to each habit
    const habitsWithRelationship = (template.habits || []).map((habit: HabitDetail) => ({
      ...habit,
      relationships: {
        ...habit.relationships,
        templateId: template.templateId,
      },
    }));

    todaysHabits.push(...habitsWithRelationship);
  });

  return todaysHabits;
};

/**
 * Formats a habit streak for display
 */
export const formatStreak = (streak: number): string => {
  if (!streak) return 'No streak';
  return streak === 1 ? '1 day' : `${streak} days`;
};

/**
 * Checks if a habit is due today
 */
export const isHabitDueToday = (habit: HabitDetail, templates: any[]): boolean => {
  // Find the template this habit belongs to
  const template = templates.find((t) => t.habits.some((h: HabitDetail) => h.id === habit.id));

  if (!template) return false;

  // Check if the template is active today
  const dayOfWeek = new Date().getDay();
  const todayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek] as DayOfWeek;

  return template.activeDays.includes(todayName);
};
