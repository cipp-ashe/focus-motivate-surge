
import { HabitTemplate } from '@/types/habits/types';

// Sample recommended templates
const templates: HabitTemplate[] = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day with a refreshing routine',
    category: 'Wellness',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    defaultHabits: [
      {
        id: 'morning-water',
        name: 'Drink Water',
        description: 'Hydrate after waking up',
        category: 'Health',
        timePreference: 'Morning',
        metrics: { type: 'boolean' }
      },
      {
        id: 'morning-stretch',
        name: 'Morning Stretch',
        description: '5-minute stretch to wake up body',
        category: 'Health',
        timePreference: 'Morning',
        metrics: { type: 'timer', goal: 300 }
      },
      {
        id: 'morning-journal',
        name: 'Gratitude Journal',
        description: 'Write down 3 things you are grateful for',
        category: 'Mental Health',
        timePreference: 'Morning',
        metrics: { type: 'journal' }
      }
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness Tracker',
    description: 'Track your fitness activities',
    category: 'Fitness',
    defaultDays: ['Mon', 'Wed', 'Fri'],
    defaultHabits: [
      {
        id: 'fitness-cardio',
        name: 'Cardio Exercise',
        description: '30 minutes of cardio',
        category: 'Fitness',
        timePreference: 'Anytime',
        metrics: { type: 'timer', goal: 1800 }
      },
      {
        id: 'fitness-strength',
        name: 'Strength Training',
        description: 'Resistance or weight training',
        category: 'Fitness',
        timePreference: 'Anytime',
        metrics: { type: 'boolean' }
      },
      {
        id: 'fitness-steps',
        name: 'Daily Steps',
        description: 'Track your daily step count',
        category: 'Fitness',
        timePreference: 'Evening',
        metrics: { type: 'number', goal: 10000, unit: 'steps' }
      }
    ]
  }
];

export const getRecommendedTemplates = (): HabitTemplate[] => {
  return templates;
};
