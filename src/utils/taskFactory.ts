
import { Task, TaskType, TaskStatus } from '@/types/tasks';
import { v4 as uuidv4 } from 'uuid';

interface CreateTaskOptions {
  type?: TaskType;
  status?: TaskStatus;
  description?: string;
  duration?: number;
  relationships?: Record<string, any>;
  tags?: string[];
}

export const createTask = (
  name: string,
  options: CreateTaskOptions = {}
): Task => {
  const {
    type = 'standard',
    status = 'todo',
    description = '',
    duration,
    relationships,
    tags = []
  } = options;

  return {
    id: uuidv4(),
    name,
    description,
    type,
    status,
    duration,
    relationships,
    tags,
    createdAt: new Date().toISOString(),
    completed: false
  };
};

