
export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'Wellness' | 'Work' | 'Personal' | 'Learning';
  timePreference: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  completed: boolean;
  streak: number;
  lastCompleted: Date | null;
  metrics?: {
    type: 'timer' | 'journal' | 'boolean' | string;
    target?: number;
    unit?: string;
  };
  relationships?: {
    templateId?: string;
    [key: string]: any;
  };
}

export const STORAGE_KEY = 'habits';

