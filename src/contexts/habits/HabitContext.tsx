
import { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { habitReducer } from './habitReducer';
import { HabitState, HabitContextActions, initialState } from './types';
import { useHabitEvents } from './useHabitEvents';
import { createHabitActions } from './useHabitActions';
import { eventManager } from '@/lib/events/EventManager';

// Create contexts with proper typing
const HabitContext = createContext<HabitState | undefined>(undefined);
const HabitActionsContext = createContext<HabitContextActions | undefined>(undefined);

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const loadedRef = useRef(false);
  const habitsCheckedRef = useRef(false);
  
  // Load initial templates
  const { data, refetch } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      // Prevent duplicate loading
      if (loadedRef.current) return state.templates;
      loadedRef.current = true;
      
      try {
        const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
        console.log("Initial templates loaded from localStorage:", templates);
        dispatch({ type: 'LOAD_TEMPLATES', payload: templates });
        
        // Also load custom templates
        const customTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
        dispatch({ type: 'LOAD_CUSTOM_TEMPLATES', payload: customTemplates });
        
        // Mark as loaded and trigger habit processing once
        setTimeout(() => {
          if (!habitsCheckedRef.current) {
            habitsCheckedRef.current = true;
            // Update habit processing
            eventManager.emit('habits:check-pending', {});
          }
        }, 300);
        
        return templates;
      } catch (error) {
        console.error('Error loading habits:', error);
        toast.error('Failed to load habits');
        return [];
      }
    }
  });

  // Set up event handlers with the current templates
  // Pass state.templates to avoid circular dependency
  const eventHandlers = useHabitEvents(state.templates);

  // Create action handlers with refetch capability
  const baseActions = createHabitActions(state, dispatch);
  const actions: HabitContextActions = {
    ...baseActions,
    reloadTemplates: () => {
      refetch();
      
      // Also trigger events to ensure task synchronization
      setTimeout(() => {
        eventManager.emit('habits:check-pending', {});
        window.dispatchEvent(new Event('force-habits-update'));
      }, 100);
    }
  };

  // Force periodic verification of habit tasks but at a reasonable interval
  useEffect(() => {
    const checkInterval = setInterval(() => {
      console.log('HabitContext: Periodic habit check');
      eventManager.emit('habits:check-pending', {});
    }, 120000); // Check every 2 minutes instead of every minute
    
    return () => clearInterval(checkInterval);
  }, []);

  return (
    <HabitContext.Provider value={state}>
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

/**
 * Combined hook for habit context and actions
 */
export const useHabitContext = () => {
  const state = useHabitState();
  const actions = useHabitActions();
  
  return { ...state, ...actions };
};
