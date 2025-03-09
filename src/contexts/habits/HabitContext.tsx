
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTodaysHabits } from '@/hooks/useTodaysHabits';
import { habitReducer } from './habitReducer';
import { HabitState, HabitContextActions, initialState } from './types';
import { useHabitEvents } from './useHabitEvents';
import { useHabitActions } from './useHabitActions';

const HabitContext = createContext<HabitState | undefined>(undefined);
const HabitActionsContext = createContext<HabitContextActions | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  
  // Initialize today's habits
  const { todaysHabits } = useTodaysHabits(state.templates);
  
  // Set up event handlers
  useHabitEvents(state, dispatch);

  // Load initial templates
  useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      try {
        const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
        console.log("Initial templates loaded from localStorage:", templates);
        dispatch({ type: 'LOAD_TEMPLATES', payload: templates });
        
        // Also load custom templates
        const customTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
        dispatch({ type: 'LOAD_CUSTOM_TEMPLATES', payload: customTemplates });
        
        return templates;
      } catch (error) {
        console.error('Error loading habits:', error);
        toast.error('Failed to load habits');
        return [];
      }
    }
  });

  // Create action handlers
  const actions = useHabitActions(state, dispatch);

  return (
    <HabitContext.Provider value={{ ...state, todaysHabits }}>
      <HabitActionsContext.Provider value={actions}>
        {children}
      </HabitActionsContext.Provider>
    </HabitContext.Provider>
  );
};

export const useHabitState = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabitState must be used within a HabitProvider');
  }
  return context;
};

export const useHabitActions = () => {
  const context = useContext(HabitActionsContext);
  if (context === undefined) {
    throw new Error('useHabitActions must be used within a HabitProvider');
  }
  return context;
};
