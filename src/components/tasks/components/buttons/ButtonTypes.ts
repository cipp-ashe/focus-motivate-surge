
import { Task } from '@/types/tasks';

export interface TaskButtonProps {
  task: Task;
  onTaskAction: (e: React.MouseEvent<HTMLButtonElement>, actionType?: string) => void;
}
