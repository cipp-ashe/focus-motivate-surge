
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { syncLocalDataToSupabase } from '@/lib/sync/dataSynchronizer';
import { eventManager } from '@/lib/events/EventManager';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null, user: User | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // If user just logged in, sync localStorage data to Supabase
      if (session?.user && localStorage.getItem('firstLogin') !== 'completed') {
        syncLocalDataToSupabase(session.user.id);
        localStorage.setItem('firstLogin', 'completed');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Emit an event that user authentication state has changed
      eventManager.emit('auth:state-change', { 
        event: _event, 
        user: session?.user ?? null 
      });
      
      // If user just logged in, sync localStorage data to Supabase
      if (session?.user && _event === 'SIGNED_IN' && localStorage.getItem('firstLogin') !== 'completed') {
        syncLocalDataToSupabase(session.user.id);
        localStorage.setItem('firstLogin', 'completed');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(`Sign in failed: ${(error as Error).message}`);
      return { error: error as Error };
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (error) throw error;
      toast.success('Magic link sent! Check your email');
      return { error: null };
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error(`Failed to send magic link: ${(error as Error).message}`);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      
      toast.success('Account created successfully!', {
        description: 'Check your email for the confirmation link.'
      });
      
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(`Sign up failed: ${(error as Error).message}`);
      return { error: error as Error, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(`Sign out failed: ${(error as Error).message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      signIn, 
      signUp,
      signInWithMagicLink,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
