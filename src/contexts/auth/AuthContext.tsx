
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, enableRealtimeForTables } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { syncLocalDataToSupabase } from '@/lib/sync/dataSynchronizer';
import { eventManager } from '@/lib/events/EventManager';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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
      
      // Enable realtime if user is authenticated
      if (session?.user) {
        enableRealtimeForTables();
      }
      
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
      if (session?.user && _event === 'SIGNED_IN') {
        // Enable realtime features
        enableRealtimeForTables();
        
        // Sync data if it's first login
        if (localStorage.getItem('firstLogin') !== 'completed') {
          syncLocalDataToSupabase(session.user.id);
          localStorage.setItem('firstLogin', 'completed');
        }

        toast.success('Signed in successfully');
        eventManager.emit('auth:signed-in', { user: session.user });
      } else if (_event === 'SIGNED_OUT') {
        eventManager.emit('auth:signed-out', {});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
