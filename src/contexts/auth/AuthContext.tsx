
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  isLocalOnly: boolean;
  setLocalOnly: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for stored preference, default to true (local-only) for new users
  const [isLocalOnly, setIsLocalOnly] = useState(() => {
    const stored = localStorage.getItem('prefer-local-only');
    // If no preference is stored, default to true (local-only mode)
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('prefer-local-only', isLocalOnly.toString());
  }, [isLocalOnly]);

  useEffect(() => {
    // Skip auth checking if user has opted for local-only mode
    if (isLocalOnly) {
      setIsLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in');
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isLocalOnly]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isLoading, 
      isAuthenticated: !!user, 
      signOut: handleSignOut,
      isLocalOnly,
      setLocalOnly: (value) => setIsLocalOnly(value)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
