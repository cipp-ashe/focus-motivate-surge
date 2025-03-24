
import { 
  HabitTemplate, 
  HabitDetail, 
  MetricType,
  HabitCategory,
  TimePreference,
  DEFAULT_WEEKDAYS,
  DEFAULT_ALL_DAYS,
  DayOfWeek
} from '@/types/habits/types';

/**
 * Helper function to create a habit detail with consistent structure
 */
const createHabitDetail = (
  id: string,
  name: string,
  description: string,
  metricType: MetricType,
  category: HabitCategory | string,
  timePreference: TimePreference,
  goal?: number,
  unit?: string,
  tips: string[] = []
): HabitDetail => ({
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
  tips
});

/**
 * Organized collection of recommended templates
 */
const templates: Record<string, HabitTemplate> = {
  // ===== Wellness Templates =====
  
  morningRoutine: {
    id: 'morning-routine',
    name: 'Morning Routine',
    description: 'Start your day with intention and energy',
    category: 'Wellness',
    color: '#9b87f5',
    icon: 'sun',
    defaultDays: DEFAULT_WEEKDAYS,
    defaultHabits: [
      createHabitDetail(
        'morning-water',
        'Drink Water',
        'Start your day with hydration',
        'boolean',
        'Health',
        'Morning',
        undefined,
        undefined,
        ['Keep a water bottle by your bed', 'Add lemon for vitamin C and flavor']
      ),
      createHabitDetail(
        'morning-stretch',
        'Morning Stretch',
        'Gentle stretching to wake up your body',
        'timer',
        'Fitness',
        'Morning',
        300,
        'seconds',
        ['Focus on gentle movements', 'Breathe deeply during each stretch']
      ),
      createHabitDetail(
        'morning-planning',
        'Plan Your Day',
        'Set intentions and priorities for the day',
        'journal',
        'Productivity',
        'Morning',
        undefined,
        undefined,
        ['Write down your top 3 priorities', 'Review your calendar for the day']
      )
    ]
  },
  
  mindfulness: {
    id: 'mindfulness',
    name: 'Daily Mindfulness',
    description: 'Cultivate presence and reduce stress',
    category: 'Mental Health',
    color: '#7E69AB',
    icon: 'brain',
    defaultDays: DEFAULT_ALL_DAYS,
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
          'Focus on your breath',
          'If your mind wanders, gently bring it back'
        ]
      ),
      createHabitDetail(
        'gratitude',
        'Gratitude Journal',
        'Note things you\'re thankful for',
        'journal',
        'Mental Health',
        'Evening',
        undefined,
        undefined,
        [
          'Write down 3 things you\'re grateful for',
          'Be specific about what you appreciate and why',
          'Include both small joys and bigger blessings'
        ]
      ),
      createHabitDetail(
        'mindful-moment',
        'Mindful Moment',
        'Take a mindful break during the day',
        'timer',
        'Mental Health',
        'Afternoon',
        180,
        'seconds',
        [
          'Step away from screens',
          'Take deep breaths',
          'Notice your surroundings using all your senses'
        ]
      )
    ]
  },

  // ===== Fitness Templates =====
  
  fitnessTracker: {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: 'Track your daily exercise and activity',
    category: 'Fitness',
    color: '#0EA5E9',
    icon: 'dumbbell',
    defaultDays: ['Mon', 'Wed', 'Fri'],
    defaultHabits: [
      createHabitDetail(
        'cardio-workout',
        'Cardio Exercise',
        'Get your heart rate up',
        'timer',
        'Fitness',
        'Anytime',
        1800,
        'seconds',
        ['Choose an activity you enjoy', 'Aim for moderate intensity']
      ),
      createHabitDetail(
        'strength-training',
        'Strength Training',
        'Build muscle and bone density',
        'boolean',
        'Fitness',
        'Anytime',
        undefined,
        undefined,
        ['Focus on proper form', 'Start with lighter weights and build up']
      ),
      createHabitDetail(
        'daily-steps',
        'Daily Steps',
        'Track your movement throughout the day',
        'counter',
        'Fitness',
        'Evening',
        10000,
        'steps',
        ['Take short walking breaks', 'Use stairs instead of elevators']
      ),
      createHabitDetail(
        'workout-rating',
        'Rate Your Workout',
        'Track your perceived exertion and satisfaction',
        'rating',
        'Fitness',
        'Evening',
        5,
        undefined,
        ['Consider both effort and enjoyment', 'Use this to adjust future workouts']
      )
    ]
  },
  
  // ===== Productivity Templates =====
  
  workProductivity: {
    id: 'work-productivity',
    name: 'Work Productivity',
    description: 'Boost your focus and output at work',
    category: 'Productivity',
    color: '#F97316',
    icon: 'briefcase',
    defaultDays: DEFAULT_WEEKDAYS,
    defaultHabits: [
      createHabitDetail(
        'deep-work',
        'Deep Work Session',
        'Focused work without distractions',
        'timer',
        'Work',
        'Morning',
        5400,
        'seconds',
        ['Turn off notifications', 'Define a clear objective before starting']
      ),
      createHabitDetail(
        'task-review',
        'Review Task List',
        'Update and prioritize your tasks',
        'boolean',
        'Work',
        'Morning',
        undefined,
        undefined,
        ['Identify your top 3 priorities', 'Be realistic about what you can accomplish']
      ),
      createHabitDetail(
        'work-reflection',
        'End-of-Day Reflection',
        'Review accomplishments and plan for tomorrow',
        'journal',
        'Work',
        'Evening',
        undefined,
        undefined,
        ['Note what went well', 'Identify what could improve', 'Set intentions for tomorrow']
      )
    ]
  },
  
  dailyReview: {
    id: 'daily-review',
    name: 'Daily Review',
    description: 'Reflect on your day and plan for success',
    category: 'Productivity',
    color: '#D946EF',
    icon: 'clipboard-check',
    defaultDays: DEFAULT_ALL_DAYS,
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
          'Do this before checking emails',
          'Review your top 3 priorities',
          'Check your calendar for important meetings'
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
          'Review what went well today',
          'Note any unfinished tasks to move to tomorrow',
          'End with a moment of gratitude'
        ]
      ),
    ]
  }
};

/**
 * Returns all recommended templates
 */
export const getRecommendedTemplates = (): HabitTemplate[] => {
  return Object.values(templates);
};

/**
 * Returns a specific template by ID
 */
export const getTemplateById = (id: string): HabitTemplate | undefined => {
  return Object.values(templates).find(template => template.id === id);
};
