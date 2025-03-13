
import type { StateContext } from '@/types/state/index';
import type { Task, TaskMetrics } from '@/types/tasks';
import type { TimerStateMetrics } from '@/types/metrics';

type TaskAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; metrics?: TaskMetrics | TimerStateMetrics } }
  | { type: 'SELECT_TASK'; payload: string | null };

export const taskReducer = (state: StateContext['tasks'], action: TaskAction): StateContext['tasks'] => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        items: state.items.map(task =>
          task.id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        items: state.items.filter(task => task.id !== action.payload),
        selected: state.selected === action.payload ? null : state.selected,
      };

    case 'COMPLETE_TASK': {
      const task = state.items.find(t => t.id === action.payload.taskId);
      if (!task) return state;

      // Format metrics properly for storage
      const formattedMetrics: TaskMetrics = action.payload.metrics ? {
        // Ensure all metrics are properly typed
        timeSpent: action.payload.metrics.timeSpent || action.payload.metrics.actualDuration,
        timeElapsed: action.payload.metrics.actualDuration,
        pauseCount: action.payload.metrics.pauseCount || 0,
        completionDate: new Date().toISOString(),
        // Timer-specific metrics
        expectedTime: action.payload.metrics.expectedTime,
        actualDuration: action.payload.metrics.actualDuration,
        favoriteQuotes: Array.isArray(action.payload.metrics.favoriteQuotes)
          ? action.payload.metrics.favoriteQuotes
          : [],
        pausedTime: action.payload.metrics.pausedTime,
        extensionTime: action.payload.metrics.extensionTime,
        netEffectiveTime: action.payload.metrics.netEffectiveTime,
        efficiencyRatio: action.payload.metrics.efficiencyRatio,
        completionStatus: action.payload.metrics.completionStatus,
      } : {};

      const completedTask = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString(),
        metrics: formattedMetrics,
      };

      console.log('taskReducer: Completing task with metrics:', completedTask);

      return {
        ...state,
        items: state.items.filter(t => t.id !== action.payload.taskId),
        completed: [...state.completed, completedTask],
        selected: state.selected === action.payload.taskId ? null : state.selected,
      };
    }

    case 'SELECT_TASK':
      return {
        ...state,
        selected: action.payload,
      };

    default:
      return state;
  }
};
