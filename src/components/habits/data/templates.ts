
import { HabitTemplate } from '@/types/habits/types';

// Sample exercise template
export const exerciseTemplate: HabitTemplate = {
  id: 'exercise-routine',
  name: 'Daily Exercise Routine',
  description: 'A complete daily exercise routine to keep you fit',
  category: 'Health',
  defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  defaultHabits: [
    {
      id: 'morning-stretch',
      name: 'Morning Stretching',
      description: 'Start your day with a 5-minute stretch routine',
      category: 'Health',
      timePreference: 'Morning',
      metrics: {
        type: 'timer',
        goal: 300,
        unit: 'seconds'
      }
    },
    {
      id: 'cardio-workout',
      name: 'Cardio Workout',
      description: '20-minute cardio session',
      category: 'Health',
      timePreference: 'Afternoon',
      metrics: {
        type: 'timer',
        goal: 1200,
        unit: 'seconds'
      }
    },
    {
      id: 'strength-training',
      name: 'Strength Training',
      description: 'Focus on a different muscle group each day',
      category: 'Health',
      timePreference: 'Evening',
      metrics: {
        type: 'boolean'
      }
    },
    {
      id: 'daily-steps',
      name: 'Daily Steps',
      description: 'Reach your step goal',
      category: 'Health',
      timePreference: 'Anytime',
      metrics: {
        type: 'counter',
        goal: 10000,
        unit: 'steps'
      }
    }
  ]
};

// Sample work productivity template
export const productivityTemplate: HabitTemplate = {
  id: 'work-productivity',
  name: 'Work Productivity',
  description: 'Boost your productivity at work',
  category: 'Work',
  defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  defaultHabits: [
    {
      id: 'morning-planning',
      name: 'Morning Planning',
      description: 'Plan your day in the morning',
      category: 'Work',
      timePreference: 'Morning',
      metrics: {
        type: 'journal'
      }
    },
    {
      id: 'deep-work',
      name: 'Deep Work Session',
      description: 'Focus on important tasks without distractions',
      category: 'Work',
      timePreference: 'Morning',
      metrics: {
        type: 'timer',
        goal: 5400,
        unit: 'seconds'
      }
    },
    {
      id: 'daily-reflection',
      name: 'End-of-day Reflection',
      description: 'Reflect on your accomplishments and plan for tomorrow',
      category: 'Work',
      timePreference: 'Evening',
      metrics: {
        type: 'journal'
      }
    }
  ]
};

// Sample mindfulness template
export const mindfulnessTemplate: HabitTemplate = {
  id: 'mindfulness',
  name: 'Daily Mindfulness',
  description: 'Cultivate mindfulness and reduce stress',
  category: 'Health',
  defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  defaultHabits: [
    {
      id: 'morning-meditation',
      name: 'Morning Meditation',
      description: '10-minute morning meditation',
      category: 'Health',
      timePreference: 'Morning',
      metrics: {
        type: 'timer',
        goal: 600,
        unit: 'seconds'
      }
    },
    {
      id: 'gratitude-journal',
      name: 'Gratitude Journal',
      description: 'Write down three things you are grateful for',
      category: 'Personal',
      timePreference: 'Evening',
      metrics: {
        type: 'journal'
      }
    },
    {
      id: 'daily-mood',
      name: 'Track Your Mood',
      description: 'Rate your mood and emotions',
      category: 'Health',
      timePreference: 'Evening',
      metrics: {
        type: 'rating',
        goal: 5
      }
    }
  ]
};

export const recommendedTemplates = [
  exerciseTemplate,
  productivityTemplate,
  mindfulnessTemplate
];
