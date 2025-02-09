import { HabitTemplate, HabitDetail, HabitInsight } from '../components/habits/types';
export type { HabitTemplate, HabitDetail } from '../components/habits/types';

const createHabitInsight = (type: HabitInsight['type'], description: string): HabitInsight => ({
  type,
  description,
});

export const habitTemplates: HabitTemplate[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Track your mindfulness habits',
    category: 'Wellbeing',
    defaultHabits: [
      {
        id: 'mindfulness-meditation',
        name: 'Meditation',
        description: 'Daily meditation practice',
        category: 'Wellbeing',
        timePreference: 'Morning',
        metrics: { type: 'duration', unit: 'minutes', min: 5, target: 15 },
        insights: [
          createHabitInsight('streak', 'Meditation is most effective when practiced consistently'),
          createHabitInsight('timing', 'Morning meditation sets a calm tone for the day')
        ],
        tips: [
          'Start with just 5 minutes and gradually increase',
          'Find a quiet space where you won\'t be disturbed'
        ],
      },
      {
        id: 'mindfulness-gratitude',
        name: 'Gratitude Journal',
        description: 'Write down things you are grateful for',
        category: 'Wellbeing',
        timePreference: 'Evening',
        metrics: { type: 'boolean' },
        insights: [
          createHabitInsight('completion', 'Evening reflection helps process the day\'s events'),
          createHabitInsight('pattern', 'Regular gratitude practice improves overall wellbeing')
        ],
        tips: [
          'Write down 3 things you\'re grateful for each day',
          'Be specific about what you appreciate'
        ],
      },
    ],
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    id: 'daily-review',
    name: 'Daily Review',
    description: 'Track your daily review habits',
    category: 'Productivity',
    defaultHabits: [
      {
        id: 'daily-review-morning',
        name: 'Morning Review',
        description: 'Review your goals and plan for the day',
        category: 'Productivity',
        timePreference: 'Morning',
        metrics: { type: 'boolean' },
        insights: [
          createHabitInsight('timing', 'Morning planning sets clear intentions for the day'),
          createHabitInsight('streak', 'Consistent morning reviews improve daily productivity')
        ],
        tips: [
          'Review your top 3 priorities for the day',
          'Check your calendar for important meetings'
        ],
      },
      {
        id: 'daily-review-evening',
        name: 'Evening Review',
        description: 'Reflect on your day and plan for tomorrow',
        category: 'Productivity',
        timePreference: 'Evening',
        metrics: { type: 'boolean' },
        insights: [
          createHabitInsight('completion', 'Evening reviews help process accomplishments'),
          createHabitInsight('pattern', 'Planning tomorrow reduces morning stress')
        ],
        tips: [
          'Celebrate your wins for the day',
          'Write down tomorrow\'s most important task'
        ],
      },
    ],
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Track your fitness habits',
    category: 'Health',
    defaultHabits: [
      {
        id: 'fitness-exercise',
        name: 'Exercise',
        description: 'Daily exercise routine',
        category: 'Health',
        timePreference: 'Anytime',
        metrics: { type: 'duration', unit: 'minutes', min: 5, target: 30 },
        insights: [
          createHabitInsight('streak', 'Regular exercise builds momentum'),
          createHabitInsight('timing', 'Find your optimal workout time')
        ],
        tips: [
          'Start with short sessions and build up',
          'Mix cardio and strength training'
        ],
      },
      {
        id: 'fitness-water',
        name: 'Water Intake',
        description: 'Track your daily water intake',
        category: 'Health',
        timePreference: 'Anytime',
        metrics: { type: 'count', target: 8 },
        insights: [
          createHabitInsight('completion', 'Staying hydrated improves energy levels'),
          createHabitInsight('pattern', 'Regular water intake throughout the day is best')
        ],
        tips: [
          'Keep a water bottle nearby',
          'Set reminders to drink water regularly'
        ],
      },
    ],
  },
];

// Helper function to create a new template with proper defaults
export const createTemplate = (template: Omit<HabitTemplate, 'id' | 'defaultHabits'>): HabitTemplate => ({
  ...template,
  id: `template-${Date.now()}`,
  defaultHabits: [],
});
