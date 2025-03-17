/**
 * Task type enum for type checking
 * Defines the different types of tasks supported by the application
 */
export type TaskType = 'timer' | 'regular' | 'screenshot' | 'journal' | 'checklist' | 'voicenote' | 'focus';

/**
 * Task status to track progress
 * Defines the different statuses a task can have during its lifecycle
 */
export type TaskStatus = 'pending' | 'started' | 'in-progress' | 'delayed' | 'completed' | 'dismissed';

/**
 * Task metrics interface
 * Contains metrics and statistics tracked for tasks
 */
export interface TaskMetrics {
  /** Time spent on the task in seconds */
  timeSpent?: number;
  /** Total elapsed time including pauses */
  timeElapsed?: number;
  /** Number of times the task was paused */
  pauseCount?: number;
  /** ISO string of when the task was completed */
  completionDate?: string;
  /** Current streak for recurring tasks */
  streak?: number;
  
  // Timer task specific metrics
  /** Expected time for the task in seconds */
  expectedTime?: number;
  /** Actual duration of the task in seconds */
  actualDuration?: number;
  /** Array of quotes saved during the task */
  favoriteQuotes?: string[];
  /** Time spent paused in seconds */
  pausedTime?: number;
  /** Time added as extension in seconds */
  extensionTime?: number;
  /** Effective work time (excluding pauses) */
  netEffectiveTime?: number;
  /** Ratio of effective time to total time */
  efficiencyRatio?: number;
  /** Qualitative completion status */
  completionStatus?: string;
  /** Actual time spent in seconds */
  actualTime?: number;
}

/**
 * Task interface
 * The core data structure for tasks in the application
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Task name/title */
  name: string;
  /** Optional task description */
  description?: string;
  /** Whether the task is completed */
  completed: boolean;
  /** Duration of the task in seconds */
  duration?: number;
  /** ISO string of when the task was created */
  createdAt: string;
  /** ISO string of when the task was completed */
  completedAt?: string;
  /** ISO string of when the task was dismissed */
  dismissedAt?: string;
  /** Reason why the task was cleared */
  clearReason?: 'manual' | 'completed' | 'dismissed';
  /** Type of the task */
  taskType?: TaskType;
  /** Current status of the task */
  status?: TaskStatus;
  /** Task relationships to habits and templates */
  relationships?: {
    /** ID of the habit this task was created from */
    habitId?: string;
    /** ID of the template containing the habit */
    templateId?: string;
    /** Date this habit task is for */
    date?: string;
  };
  /** Task performance metrics */
  metrics?: TaskMetrics;
  /** Tags associated with the task */
  tags?: Tag[];
  
  // Screenshot task specific fields
  /** URL to the screenshot or image */
  imageUrl?: string;
  /** Type of image */
  imageType?: 'screenshot' | 'image' | null;
  /** Filename of the image */
  fileName?: string;
  /** Text extracted from the image */
  capturedText?: string;
  /** Metadata about the image */
  imageMetadata?: {
    dimensions: {
      width: number;
      height: number;
    };
    fileSize: number;
    format: string;
  };
  
  /** Journal entry content for journal tasks */
  journalEntry?: string;
  
  /** Checklist items for checklist tasks */
  checklistItems?: ChecklistItem[];
  
  /** Text transcription for voice notes */
  voiceNoteText?: string;
  /** URL to the voice note audio file */
  voiceNoteUrl?: string;
  /** Duration of the voice note in seconds */
  voiceNoteDuration?: number;
}

/**
 * Storage keys for task data
 */
export const STORAGE_KEYS = {
  /** Key for active tasks in storage */
  TASKS: 'tasks',
  /** Key for completed tasks in storage */
  COMPLETED_TASKS: 'completed_tasks',
};

/**
 * Tag interface for task categorization
 */
export interface Tag {
  /** Unique identifier for the tag */
  id: string;
  /** Name of the tag */
  name: string;
  /** Optional color for the tag */
  color?: string;
}

/**
 * ChecklistItem interface for checklist tasks
 */
export interface ChecklistItem {
  /** Unique identifier for the checklist item */
  id: string;
  /** Text content of the checklist item */
  text: string;
  /** Whether the checklist item is completed */
  completed: boolean;
}

/**
 * TaskState interface for global task state
 */
export interface TaskState {
  /** Array of active tasks */
  items: Task[];
  /** Array of completed tasks */
  completed: Task[];
  /** Array of cleared tasks */
  cleared: Task[];
  /** ID of the currently selected task, if any */
  selected: string | null;
}

/**
 * TaskContextState interface for the task context
 */
export interface TaskContextState {
  /** Array of active tasks */
  items: Task[];
  /** Array of completed tasks */
  completed: Task[];
  /** ID of the currently selected task, if any */
  selected: string | null;
  /** Whether the tasks have been loaded */
  isLoaded: boolean;
}
