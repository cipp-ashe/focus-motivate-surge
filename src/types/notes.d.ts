
import { TagColor } from './habits';

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

export const isValidTagColor = (color: string): color is TagColor => {
  return ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].includes(color);
};
