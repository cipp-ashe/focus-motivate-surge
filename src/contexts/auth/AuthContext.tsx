// Fix the event payloads in the event emissions
// Only showing the relevant parts to fix

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { eventManager } from '@/lib/events/EventManager';

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SIGNED_IN'; payload: User }
  | { type: 'SIGNED_OUT' }
  | { type: 'LOADING'; payload: boolean };

interface AuthContextProps {
  state: AuthState;
  signIn: (email: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SIGNED_IN':
      return { ...state, user: action.payload, isLoading: false };
    case 'SIGNED_OUT':
      return { ...state, user: null, isLoading: false };
    case 'LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          dispatch({ type: 'SIGNED_IN', payload: session.user });
          
          // Fixed payload structure to match expected type
          eventManager.emit('auth:state-change', { 
            userId: session.user.id,
            user: session.user
          });
          
          console.log('User signed in via auth state change', session.user);
        } else {
          dispatch({ type: 'SIGNED_OUT' });
          
          // Fixed payload structure - include userId even when signing out
          eventManager.emit('auth:state-change', { 
            userId: state.user?.id || 'unknown',
            user: null
          });
          
          console.log('User signed out via auth state change');
        }
      }
    );

    // Initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        dispatch({ type: 'SIGNED_IN', payload: session.user });
      } else {
        dispatch({ type: 'SIGNED_OUT' });
      }
    }).finally(() => {
      dispatch({ type: 'LOADING', payload: false });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string) => {
    try {
      dispatch({ type: 'LOADING', payload: true });
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        console.error('Error signing in:', error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error signing in:', error);
      return false;
    } finally {
      dispatch({ type: 'LOADING', payload: false });
    }
  }, []);
  
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        return false;
      }
      
      // Fixed payload structure - use userId for consistency
      eventManager.emit('auth:signed-out', { 
        userId: state.user?.id || 'unknown'
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected error signing out:', error);
      return false;
    }
  }, [state.user?.id]);

  const value: AuthContextProps = {
    state,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
