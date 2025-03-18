
export interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number | boolean;
  timestamp: string;
}

export interface HabitStats {
  streak: number;
  completionRate: number;
  totalDays: number;
  completedDays: number;
}
