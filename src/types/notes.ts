
// Define allowed tag colors
export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

// Define tag structure
export interface Tag {
  name: string;
  color: TagColor;
}

// Define note structure
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  tags: Tag[];
}

// Define notes props
export interface NotesProps {
  hideNotes?: boolean;
}

// Check if a color is a valid TagColor
export function isValidTagColor(color: string): color is TagColor {
  return ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].includes(color as TagColor);
}
