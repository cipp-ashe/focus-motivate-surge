import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean; // Add this property
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(`Auth Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        setIsAuthenticated(true);
        toast.success('Signed in successfully!');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        toast.info('Signed out.');
        eventManager.emit('auth:signed-out', { userId: user?.id });
      } else if (event === 'USER_UPDATED') {
        setUser(session?.user || null);
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Password recovery email sent.');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/tasks`,
        }
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Sign-in Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(`Sign-out Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    signIn,
    signOut,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
