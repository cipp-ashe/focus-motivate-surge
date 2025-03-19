
import { Task } from "@/types/tasks";

export interface HabitTaskEvent {
  habitId: string;
  templateId: string;
  name: string;
  duration: number;
  date: string;
  metricType?: string;
}

export interface HabitTaskSchedulerReturn {
  scheduledTasksRef: React.MutableRefObject<Map<string, string>>;
  checkForMissingHabitTasks: () => void;
}
