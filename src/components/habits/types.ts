
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DEFAULT_ACTIVE_DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export interface ActiveTemplate {
  templateId: string;
  name: string;
  description?: string;
  habits: any[];  // Keep as any[] for backwards compatibility
  activeDays: DayOfWeek[];
  customized: boolean;
  suppressToast?: boolean;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  habits: any[];  // Keep as any[] for backwards compatibility
  activeDays?: DayOfWeek[];
}
