
import { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';
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
  const periodicCheckRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load initial templates on mount
  useEffect(() => {
    // Prevent duplicate loading using both global and local flags
    if (habitsInitialized || loadedRef.current) return;
    
    // Set flags immediately to prevent duplicate processing
    loadedRef.current = true;
    habitsInitialized = true;
    
    try {
      const templates = JSON.parse(localStorage.getItem('habit-templates') || '[]');
      
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
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load habits');
    }
  }, []);

  // Set up event handlers with the current templates
  // Pass state.templates to avoid circular dependency
  const eventHandlers = useHabitEvents(state.templates);

  // Create action handlers
  const baseActions = createHabitActions(state, dispatch);
  const actions: HabitContextActions = {
    ...baseActions,
    reloadTemplates: () => {
      // Reset the loaded flag to allow reloading
      loadedRef.current = false;
      habitsInitialized = false;
      
      // Trigger events with debounce to ensure task synchronization
      const checkTimeout = setTimeout(() => {
        eventManager.emit('habits:check-pending', {});
        window.dispatchEvent(new CustomEvent('force-habits-update'));
        clearTimeout(checkTimeout);
      }, 200);
    }
  };

  // Force periodic verification of habit tasks but at a reasonable interval and only one timer
  useEffect(() => {
    // Skip setting up if we already have a periodic check
    if (periodicCheckRef.current) return;
    
    // Set up a single interval for all checks - much less frequent
    periodicCheckRef.current = setInterval(() => {
      eventManager.emit('habits:check-pending', {});
    }, 900000); // Check every 15 minutes instead of every 5 minutes
    
    return () => {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
      }
    };
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
