
export interface Note {
  id: string;
  content: string;
  title?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}
