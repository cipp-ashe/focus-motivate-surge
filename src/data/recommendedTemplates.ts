
import { HabitTemplate, DayOfWeek } from '@/types/habits/types';

// Default workdays (Monday-Friday)
const DEFAULT_WORK_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/**
 * Get recommended habit templates
 */
export const getRecommendedTemplates = (): HabitTemplate[] => {
  return [
    {
      id: 'morning-routine',
      name: 'Morning Routine',
      description: 'Start your day right with these essential morning habits',
      category: 'Health',
      color: '#4299e1', // blue
      defaultDays: DEFAULT_WORK_DAYS,
      defaultHabits: [
        {
          id: 'morning-meditation',
          name: 'Morning Meditation',
          description: 'Start your day with 10 minutes of mindfulness',
          category: 'Health',
          timePreference: 'Morning',
          metrics: {
            type: 'timer',
            goal: 600, // 10 minutes in seconds
            unit: 'seconds'
          }
        },
        {
          id: 'water',
          name: 'Drink Water',
          description: 'Hydrate with a full glass of water',
          category: 'Health',
          timePreference: 'Morning',
          metrics: {
            type: 'boolean'
          }
        }
      ]
    },
    {
      id: 'productivity',
      name: 'Productivity',
      description: 'Boost your productivity with these essential habits',
      category: 'Work',
      color: '#ed8936', // orange
      defaultDays: DEFAULT_WORK_DAYS,
      defaultHabits: [
        {
          id: 'daily-planning',
          name: 'Daily Planning',
          description: 'Plan your day for 10 minutes',
          category: 'Work',
          timePreference: 'Morning',
          metrics: {
            type: 'timer',
            goal: 600,
            unit: 'seconds'
          }
        },
        {
          id: 'goal-review',
          name: 'Review Goals',
          description: 'Check progress on key goals',
          category: 'Work',
          timePreference: 'Evening',
          metrics: {
            type: 'boolean'
          }
        }
      ]
    }
  ];
};
