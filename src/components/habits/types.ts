
// Define day of week as specific string literals only
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | 
                         'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

// Define consistent arrays for full and short day names
export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const SHORT_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Default active days for habits (weekdays)
export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Define specific metric types instead of allowing any string
export type MetricType = 'timer' | 'counter' | 'boolean' | 'journal';

export interface HabitMetrics {
  type: MetricType;
  target?: number;
  min?: number;
  max?: number;
  unit?: string;
}

// More specific category types
export type HabitCategory = 'Wellness' | 'Work' | 'Personal' | 'Learning' | 'Custom';
export type TimePreference = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';

export interface HabitDetail {
  id: string;
  name: string;
  description?: string;
  category?: HabitCategory | string;
  timePreference?: TimePreference;
  metrics?: HabitMetrics;
  insights?: string[];
  tips?: string[];
  order?: number;
  relationships?: {
    templateId?: string;
    habitId?: string;
    [key: string]: any;
  };
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultHabits: HabitDetail[];
  defaultDays?: DayOfWeek[];
  duration?: number | null;
}

export interface ActiveTemplate {
  templateId: string;
  habits: HabitDetail[];
  activeDays: DayOfWeek[];
  customized?: boolean;
  name?: string;
  description?: string;
  relationships?: {
    habitId?: string;
    [key: string]: any;
  };
}

export interface NewTemplate {
  name: string;
  description: string;
  category?: string;
  defaultHabits: HabitDetail[];
}

export interface TemplateCardProps {
  title: string;
  description: string;
  habits: HabitDetail[];
  onAdd: () => void;
  onConfigure?: () => void;
  isActive?: boolean;
}

export interface TabSectionProps {
  customTemplates: HabitTemplate[];
  activeTemplateIds: string[];
  onSelectTemplate: (template: HabitTemplate) => void;
  onDeleteCustomTemplate: (templateId: string) => void;
  onCreateTemplate: (template: NewTemplate) => void;
}

export interface HabitProgress {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  value?: number | boolean;
  notes?: string;
  streak?: number;
}

export interface HabitProgressResult {
  value: number | boolean;
  streak: number;
  completed?: boolean;
}

// Helper function to create an empty habit
export const createEmptyHabit = (): HabitDetail => ({
  id: `habit-${Date.now()}`,
  name: 'New Habit',
  description: '',
  category: 'Personal',
  timePreference: 'Anytime',
  metrics: { type: 'boolean' },
  insights: [],
  tips: [],
});
