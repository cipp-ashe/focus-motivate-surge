
import { HabitTemplate } from '../types';

// Predefined templates for the application
export const predefinedTemplates: HabitTemplate[] = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day with intention',
    category: 'Productivity',
    defaultHabits: [
      {
        id: 'meditation',
        name: 'Meditation',
        description: 'Clear your mind for the day',
        metrics: { type: 'timer', target: 600 }
      },
      {
        id: 'journaling',
        name: 'Journaling',
        description: 'Write down your thoughts',
        metrics: { type: 'journal' }
      }
    ],
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    description: 'Maintain a healthy lifestyle',
    category: 'Health',
    defaultHabits: [
      {
        id: 'exercise',
        name: 'Exercise',
        description: 'Stay active',
        metrics: { type: 'timer', target: 1800 }
      },
      {
        id: 'water',
        name: 'Drink Water',
        description: '8 glasses per day',
        metrics: { type: 'counter', target: 8 }
      }
    ],
    defaultDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }
];
