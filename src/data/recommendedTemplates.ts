
import { HabitTemplate, MetricType } from '@/types/habits/types';

// Helper function to create a habit detail
const createHabitDetail = (
  id: string,
  name: string,
  description: string,
  metricType: MetricType,
  category: string,
  timePreference: string,
  goal?: number,
  unit?: string,
  tips?: string[]
) => ({
  id,
  name,
  description,
  category,
  timePreference,
  metrics: {
    type: metricType,
    goal,
    unit
  },
  tips: tips || []
});

// Sample recommended templates
const templates: HabitTemplate[] = [
  {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day with a refreshing routine',
    category: 'Wellness',
    defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    defaultHabits: [
      createHabitDetail(
        'morning-water',
        'Drink Water',
        'Hydrate after waking up',
        'boolean',
        'Health',
        'Morning',
        undefined,
        undefined,
        ['Drink a full glass of water right after waking up', 'Keep a water bottle by your bed']
      ),
      createHabitDetail(
        'morning-stretch',
        'Morning Stretch',
        '5-minute stretch to wake up body',
        'timer',
        'Health',
        'Morning',
        300,
        'seconds',
        ['Focus on gentle movements', 'Don\'t force any stretches', 'Breathe deeply during each stretch']
      ),
      createHabitDetail(
        'morning-journal',
        'Gratitude Journal',
        'Write down 3 things you are grateful for',
        'journal',
        'Mental Health',
        'Morning',
        undefined,
        undefined,
        ['Be specific about what you appreciate', 'Include both small joys and bigger blessings', 'Try to find new things each day']
      )
    ]
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Track your mindfulness habits',
    category: 'Wellbeing',
    defaultDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    defaultHabits: [
      createHabitDetail(
        'meditation',
        'Meditation',
        'Daily meditation practice',
        'timer',
        'Mental Health',
        'Morning',
        600,
        'seconds',
        [
          'Find a quiet space where you won\'t be disturbed',
          'Focus on your breath, counting each inhale and exhale',
          'If your mind wanders, gently bring it back to your breath',
          'Start with just 5 minutes if 10 feels too long'
        ]
      ),
      createHabitDetail(
        'gratitude-journal',
        'Gratitude Journal',
        'Write down things you are grateful for',
        'journal',
        'Mental Health',
        'Evening',
        undefined,
        undefined,
        [
          'Aim to write down 3 things you\'re grateful for each day',
          'Be specific about what you appreciate and why',
          'Include both small daily joys and bigger blessings',
          'Try to find new things to be grateful for each day'
        ]
      )
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness Tracker',
    description: 'Track your fitness activities',
    category: 'Fitness',
    defaultDays: ['Mon', 'Wed', 'Fri'],
    defaultHabits: [
      createHabitDetail(
        'fitness-cardio',
        'Cardio Exercise',
        '30 minutes of cardio',
        'timer',
        'Fitness',
        'Anytime',
        1800,
        'seconds',
        ['Choose an activity you enjoy', 'Maintain a moderate pace', 'Stay hydrated during your workout']
      ),
      createHabitDetail(
        'fitness-strength',
        'Strength Training',
        'Resistance or weight training',
        'boolean',
        'Fitness',
        'Anytime',
        undefined,
        undefined,
        ['Focus on proper form', 'Start with lighter weights', 'Gradually increase intensity over time']
      ),
      createHabitDetail(
        'fitness-steps',
        'Daily Steps',
        'Track your daily step count',
        'number',
        'Fitness',
        'Evening',
        10000,
        'steps',
        ['Take short walking breaks throughout the day', 'Use stairs instead of elevators', 'Park farther away from entrances']
      )
    ]
  },
  {
    id: 'daily-review',
    name: 'Daily Review',
    description: 'Track your daily review habits',
    category: 'Productivity',
    defaultDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    defaultHabits: [
      createHabitDetail(
        'morning-review',
        'Morning Review',
        'Review your goals and plan for the day',
        'boolean',
        'Work',
        'Morning',
        undefined,
        undefined,
        [
          'Do this first thing in the morning before checking emails',
          'Review your top 3 priorities for the day',
          'Scan your calendar for important meetings',
          'Set your intention for the day'
        ]
      ),
      createHabitDetail(
        'evening-journal',
        'Evening Journal',
        'Reflect on your day and plan for tomorrow',
        'journal',
        'Personal',
        'Evening',
        undefined,
        undefined,
        [
          'Review what went well today and what could improve',
          'Note any unfinished tasks to move to tomorrow',
          'Set your priorities for tomorrow',
          'End with a moment of gratitude'
        ]
      ),
    ]
  }
];

export const getRecommendedTemplates = (): HabitTemplate[] => {
  return templates;
};
