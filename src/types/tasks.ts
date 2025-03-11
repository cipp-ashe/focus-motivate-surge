
// Task type enum for type checking
export type TaskType = 'timer' | 'regular' | 'screenshot' | 'journal' | 'checklist' | 'voicenote';

export interface TaskMetrics {
  timeSpent?: number;
  timeElapsed?: number;
  pauseCount?: number;
  completionDate?: string;
  streak?: number;
  
  // Timer task specific metrics
  expectedTime?: number;
  actualDuration?: number;
  favoriteQuotes?: string[];
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
    habitId?: string;    // If this task was created from a habit
    templateId?: string; // The template that contains the habit
    date?: string;       // The date this habit task is for
  };
  metrics?: TaskMetrics;
  tags?: Tag[];
  
  // Screenshot task specific fields
  imageUrl?: string;
  imageType?: 'screenshot' | 'image' | null;
  fileName?: string;
  capturedText?: string;
  
  // Journal task specific field
  journalEntry?: string;
  
  // Checklist task specific field
  checklistItems?: ChecklistItem[];
  
  // Voice note task specific field
  voiceNoteText?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
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
