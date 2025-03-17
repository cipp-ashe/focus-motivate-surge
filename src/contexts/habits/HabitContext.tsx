
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

// Track habit initialization globally
let habitsInitialized = false;
let habitsChecked = false;

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const loadedRef = useRef(false);
  const habitsCheckedRef = useRef(false);
  
  // Load initial templates
  const { data, refetch } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      // Prevent duplicate loading using both global and local flags
      if (habitsInitialized || loadedRef.current) return state.templates;
      loadedRef.current = true;
      habitsInitialized = true;
      
      try {
        const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
        console.log("Initial templates loaded from localStorage:", templates);
        dispatch({ type: 'LOAD_TEMPLATES', payload: templates });
        
        // Also load custom templates
        const customTemplates = JSON.parse(localStorage.getItem('custom-templates') || '[]');
        dispatch({ type: 'LOAD_CUSTOM_TEMPLATES', payload: customTemplates });
        
        // Mark as loaded and trigger habit processing once
        if (!habitsChecked && !habitsCheckedRef.current) {
          setTimeout(() => {
            habitsCheckedRef.current = true;
            habitsChecked = true;
            // Update habit processing
            eventManager.emit('habits:check-pending', {});
          }, 300);
        }
        
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
      
      // Trigger events with debounce to ensure task synchronization
      const checkTimeout = setTimeout(() => {
        console.log('HabitContext: Triggering habit check from reloadTemplates');
        eventManager.emit('habits:check-pending', {});
        window.dispatchEvent(new CustomEvent('force-habits-update'));
        clearTimeout(checkTimeout);
      }, 200);
    }
  };

  // Force periodic verification of habit tasks but at a reasonable interval and only one timer
  useEffect(() => {
    const checkInterval = setInterval(() => {
      console.log('HabitContext: Periodic habit check');
      eventManager.emit('habits:check-pending', {});
    }, 300000); // Check every 5 minutes instead of every 2 minutes
    
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
