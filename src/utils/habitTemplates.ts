import { HabitTemplate, HabitDetail, DayOfWeek, DEFAULT_ACTIVE_DAYS } from '../components/habits/types';

const createHabitDetail = (
  name: string,
  description: string,
  metricType: 'timer' | 'counter' | 'boolean',
  target?: number
): HabitDetail => ({
  id: crypto.randomUUID(),
  name,
  description,
  metrics: {
    type: metricType,
    target: target || 1,
    unit: metricType === 'timer' ? 'minutes' : undefined
  }
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
        15
      ),
      createHabitDetail(
        'Gratitude Journal',
        'Write down things you are grateful for',
        'counter'
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
        'boolean'
      ),
      createHabitDetail(
        'Evening Review',
        'Reflect on your day and plan for tomorrow',
        'boolean'
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
        30
      ),
      createHabitDetail(
        'Water Intake',
        'Track your daily water intake',
        'counter',
        8
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
