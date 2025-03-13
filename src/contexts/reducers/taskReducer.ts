
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
        // Ensure all metrics are properly typed and handle both Timer and Task metric formats
        timeSpent: 'actualDuration' in action.payload.metrics ? 
          action.payload.metrics.actualDuration : 
          ('timeSpent' in action.payload.metrics ? action.payload.metrics.timeSpent : 0),
        timeElapsed: 'actualDuration' in action.payload.metrics ? 
          action.payload.metrics.actualDuration : 0,
        pauseCount: 'pauseCount' in action.payload.metrics ? 
          action.payload.metrics.pauseCount : 0,
        completionDate: new Date().toISOString(),
        // Timer-specific metrics - preserve all of them for timer tasks
        expectedTime: 'expectedTime' in action.payload.metrics ? 
          action.payload.metrics.expectedTime : 0,
        actualDuration: 'actualDuration' in action.payload.metrics ? 
          action.payload.metrics.actualDuration : 0,
        favoriteQuotes: 'favoriteQuotes' in action.payload.metrics && Array.isArray(action.payload.metrics.favoriteQuotes) ? 
          action.payload.metrics.favoriteQuotes : [],
        pausedTime: 'pausedTime' in action.payload.metrics ? 
          action.payload.metrics.pausedTime : 0,
        extensionTime: 'extensionTime' in action.payload.metrics ? 
          action.payload.metrics.extensionTime : 0,
        netEffectiveTime: 'netEffectiveTime' in action.payload.metrics ? 
          action.payload.metrics.netEffectiveTime : 0,
        efficiencyRatio: 'efficiencyRatio' in action.payload.metrics ? 
          action.payload.metrics.efficiencyRatio : 0,
        completionStatus: 'completionStatus' in action.payload.metrics ? 
          action.payload.metrics.completionStatus : 'Completed',
      } : {
        timeSpent: 0,
        timeElapsed: 0,
        pauseCount: 0,
        completionDate: new Date().toISOString(),
        expectedTime: 0,
        actualDuration: 0,
        favoriteQuotes: [],
        pausedTime: 0,
        extensionTime: 0,
        netEffectiveTime: 0,
        efficiencyRatio: 0,
        completionStatus: 'Completed',
      };

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
