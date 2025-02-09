
import type { Task, TaskMetrics } from '../tasks';
import type { Note } from '../notes';
import type { HabitDetail, ActiveTemplate, DayOfWeek } from '@/components/habits/types';

export type EntityType = 'task' | 'habit' | 'note' | 'template';
export type RelationType = 'habit-task' | 'task-note' | 'habit-note';

export interface EntityRelationship {
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
}

export interface StateContext {
  tasks: {
    items: Task[];
    completed: Task[];
    selected: string | null;
  };
  habits: {
    templates: ActiveTemplate[];
    todaysHabits: HabitDetail[];
    progress: Record<string, Record<string, boolean | number>>;
  };
  notes: {
    items: Note[];
    selected: string | null;
  };
  relationships: EntityRelationship[];
}

export interface StateContextActions {
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, metrics?: TaskMetrics) => void;
  selectTask: (taskId: string | null) => void;
  
  // Habit/Template actions
  addTemplate: (template: Omit<ActiveTemplate, 'templateId'>) => void;
  updateTemplate: (templateId: string, updates: Partial<ActiveTemplate>) => void;
  removeTemplate: (templateId: string) => void;
  updateTemplateOrder: (templates: ActiveTemplate[]) => void;
  updateTemplateDays: (templateId: string, days: DayOfWeek[]) => void;
  
  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  deleteNote: (noteId: string) => void;
  selectNote: (noteId: string | null) => void;
  
  // Relationship actions
  addRelationship: (relationship: Omit<EntityRelationship, 'id'>) => void;
  removeRelationship: (sourceId: string, targetId: string) => void;
}
