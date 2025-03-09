
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
