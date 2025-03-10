
// Task type enum for type checking
export type TaskType = 'habit' | 'timer' | 'regular' | 'screenshot' | 'journal' | 'checklist';

export interface TaskMetrics {
  timeSpent?: number;
  timeElapsed?: number;
  pauseCount?: number;
  completionDate?: string;
  streak?: number;
  
  // Add missing properties referenced in other components
  expectedTime?: number;
  actualDuration?: number;
  favoriteQuotes?: string[]; // Changed from number to string[] to match TimerMetrics
  pausedTime?: number;
  extensionTime?: number;
  netEffectiveTime?: number;
  efficiencyRatio?: number;
  completionStatus?: string;
  actualTime?: number;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  duration?: number;
  createdAt: string;
  completedAt?: string;
  clearReason?: 'manual' | 'completed';
  taskType?: TaskType; // Using the TaskType enum
  relationships?: {
    habitId?: string;
    templateId?: string;
    date?: string;
  };
  metrics?: TaskMetrics;
  tags?: Tag[];
  imageUrl?: string;
  imageType?: 'screenshot' | 'image' | null;
  fileName?: string;
  capturedText?: string;
  journalEntry?: string;
  checklistItems?: ChecklistItem[];
}

export const STORAGE_KEYS = {
  TASKS: 'tasks',
  COMPLETED_TASKS: 'completed_tasks',
};

// Define Tag here since it appears to be missing or not exported properly
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

// Add ChecklistItem interface for checklist tasks
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// Add TaskState export to fix the error in TaskContext.tsx
export interface TaskState {
  items: Task[];
  completed: Task[];
  cleared: Task[];
  selected: string | null;
}
