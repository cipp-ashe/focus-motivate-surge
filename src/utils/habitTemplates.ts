
import { HabitTemplate, HabitDetail, DayOfWeek, DEFAULT_ACTIVE_DAYS } from '../components/habits/types';

const createHabitDetail = (
  name: string,
  description: string,
  metricType: 'timer' | 'counter' | 'boolean' | 'rating',
  target?: number,
  tips?: string[]
): HabitDetail => ({
  id: crypto.randomUUID(),
  name,
  description,
  metrics: {
    type: metricType,
    target: target || (metricType === 'timer' ? 600 : 1),
    unit: metricType === 'timer' ? 'minutes' : undefined
  },
  tips: tips || []
});

export const habitTemplates: HabitTemplate[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    description: 'Track your mindfulness habits',
    category: 'Wellbeing',
    defaultHabits: [
      createHabitDetail(
        'Meditation',
        'Daily meditation practice',
        'timer',
        600, // 10 minutes in seconds
        [
          'Find a quiet space where you won\'t be disturbed',
          'Focus on your breath, counting each inhale and exhale',
          'If your mind wanders, gently bring it back to your breath',
          'Start with just 5 minutes if 10 feels too long'
        ]
      ),
      createHabitDetail(
        'Gratitude Journal',
        'Write down things you are grateful for',
        'counter',
        3,
        [
          'Aim to write down 3 things you\'re grateful for each day',
          'Be specific about what you appreciate and why',
          'Include both small daily joys and bigger blessings',
          'Try to find new things to be grateful for each day'
        ]
      ),
    ],
    defaultDays: DEFAULT_ACTIVE_DAYS,
  },
  {
    id: 'daily-review',
    name: 'Daily Review',
    description: 'Track your daily review habits',
    category: 'Productivity',
    defaultHabits: [
      createHabitDetail(
        'Morning Review',
        'Review your goals and plan for the day',
        'boolean',
        1,
        [
          'Do this first thing in the morning before checking emails',
          'Review your top 3 priorities for the day',
          'Scan your calendar for important meetings',
          'Set your intention for the day'
        ]
      ),
      createHabitDetail(
        'Evening Review',
        'Reflect on your day and plan for tomorrow',
        'boolean',
        1,
        [
          'Review what went well today and what could improve',
          'Note any unfinished tasks to move to tomorrow',
          'Set your priorities for tomorrow',
          'End with a moment of gratitude'
        ]
      ),
    ],
    defaultDays: DEFAULT_ACTIVE_DAYS,
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Track your fitness habits',
    category: 'Health',
    defaultHabits: [
      createHabitDetail(
        'Exercise',
        'Daily exercise routine',
        'timer',
        1800, // 30 minutes in seconds
        [
          'Choose an activity you enjoy to make it sustainable',
          'Start with short sessions if you\'re new to exercise',
          'Mix cardio, strength, and flexibility for best results',
          'Remember that consistency matters more than intensity'
        ]
      ),
      createHabitDetail(
        'Water Intake',
        'Track your daily water intake',
        'counter',
        8,
        [
          'Try to drink a glass of water first thing in the morning',
          'Carry a water bottle with you throughout the day',
          'Set reminders if you tend to forget',
          'Increase intake during exercise or hot weather'
        ]
      ),
    ],
    defaultDays: DEFAULT_ACTIVE_DAYS,
  },
];

export const createTemplate = (template: Omit<HabitTemplate, 'id' | 'defaultHabits' | 'duration'>): HabitTemplate => ({
  ...template,
  id: `template-${Date.now()}`,
  defaultHabits: [],
  duration: null,
});
