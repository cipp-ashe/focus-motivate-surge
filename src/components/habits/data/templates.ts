
import { HabitTemplate } from '../types';

export const predefinedTemplates: HabitTemplate[] = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day with intention and energy',
    category: 'Wellness',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    defaultHabits: [
      {
        id: 'morning-meditation',
        name: 'Morning Meditation',
        description: 'Start with a 5-10 minute meditation to center yourself',
        category: 'Wellness',
        timePreference: 'Morning',
        metrics: { type: 'timer', target: 10, unit: 'minutes' }
      },
      {
        id: 'morning-journal',
        name: 'Morning Journal',
        description: 'Write your intentions for the day',
        category: 'Personal',
        timePreference: 'Morning',
        metrics: { type: 'journal' }
      },
      {
        id: 'healthy-breakfast',
        name: 'Healthy Breakfast',
        description: 'Eat a nutritious breakfast',
        category: 'Wellness',
        timePreference: 'Morning',
        metrics: { type: 'boolean' }
      }
    ]
  },
  {
    id: 'work-productivity',
    name: 'Work Productivity',
    description: 'Boost your productivity and focus during work',
    category: 'Work',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    defaultHabits: [
      {
        id: 'priority-setting',
        name: 'Set Daily Priorities',
        description: 'Identify your top 3 priorities for the day',
        category: 'Work',
        timePreference: 'Morning',
        metrics: { type: 'boolean' }
      },
      {
        id: 'focus-blocks',
        name: 'Focus Blocks',
        description: 'Complete at least 3 focused work blocks of 25 minutes',
        category: 'Work',
        timePreference: 'Anytime',
        metrics: { type: 'counter', target: 3 }
      },
      {
        id: 'work-breaks',
        name: 'Take Regular Breaks',
        description: 'Step away from your desk for at least 5 minutes every hour',
        category: 'Wellness',
        timePreference: 'Anytime',
        metrics: { type: 'counter', target: 8 }
      }
    ]
  },
  {
    id: 'evening-routine',
    name: 'Evening Routine',
    description: 'Wind down and prepare for restful sleep',
    category: 'Wellness',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    defaultHabits: [
      {
        id: 'screen-cutoff',
        name: 'No Screens 1hr Before Bed',
        description: 'Turn off all screens at least 1 hour before bedtime',
        category: 'Wellness',
        timePreference: 'Evening',
        metrics: { type: 'boolean' }
      },
      {
        id: 'evening-reading',
        name: 'Read Before Bed',
        description: 'Read a physical book for at least 20 minutes',
        category: 'Learning',
        timePreference: 'Evening',
        metrics: { type: 'timer', target: 20, unit: 'minutes' }
      },
      {
        id: 'tomorrow-prep',
        name: 'Prepare for Tomorrow',
        description: 'Lay out clothes, prepare lunch, review schedule',
        category: 'Personal',
        timePreference: 'Evening',
        metrics: { type: 'boolean' }
      }
    ]
  }
];
