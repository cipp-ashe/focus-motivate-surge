
export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface Tag {
  name: string;
  color: TagColor;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  tags: Tag[];
}

export interface NotesProps {
  hideNotes?: boolean;
  onOpenEmailModal?: () => void;
}

export const isValidTagColor = (color: string): color is TagColor => {
  return ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].includes(color);
};
