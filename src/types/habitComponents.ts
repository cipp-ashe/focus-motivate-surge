
/**
 * Types specific to habit components
 */
import { ActiveTemplate, HabitDetail, DayOfWeek } from './habit';

// Template card props
export interface TemplateCardProps {
  template: ActiveTemplate;
  onConfigure: () => void;
  onRemove: () => void;
}

// Configuration dialog types
export interface ConfigureTemplateDialogProps {
  isOpen: boolean;
  template: ActiveTemplate | null;
  onClose: () => void;
  onSave: (template: ActiveTemplate) => void;
}

// Template list props
export interface TemplateListProps {
  templates: ActiveTemplate[];
  onRemoveTemplate: (templateId: string) => void;
  onConfigureTemplate: (template: ActiveTemplate) => void;
}

// Selection sheet props 
export interface TemplateSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateSelect: (template: ActiveTemplate) => void;
}

// Drag and drop types
export interface DraggableHabitProps {
  habit: HabitDetail;
  index: number;
  onRemove: (id: string) => void;
}

export interface HabitDragItem {
  id: string;
  index: number;
  type: string;
}

export interface DayToggleProps {
  days: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

// Journal types
export interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitId?: string;
  habitName?: string;
  templateId?: string;
  description?: string;
  date?: string;
  taskId?: string;
}

export interface JournalContentProps {
  habitId?: string;
  habitName?: string;
  templateId?: string;
  taskId?: string;
  date?: string;
  description?: string;
  onClose: () => void;
  onSave: (content: string) => void;
}

export interface JournalPrompt {
  text: string;
  category: 'reflection' | 'motivation' | 'general';
}

// Insight types
export interface InsightCardProps {
  title: string;
  description: string;
  data: any;
  type: 'chart' | 'stat' | 'text';
}

export interface ProgressChartProps {
  habitId: string;
  days?: number;
  showStreak?: boolean;
}
