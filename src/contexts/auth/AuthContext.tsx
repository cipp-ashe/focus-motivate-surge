import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { eventManager } from '@/lib/events/EventManager';

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        setSession(session);
        setUser(session?.user || null);
      } catch (error: any) {
        console.error("Error getting session:", error.message);
        toast.error(`Error getting session: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSession();
    
    supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      setSession(session);
    });
  }, []);
  
  const signIn = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      toast.success('Check your email for the magic link.');
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      toast.error(`Error signing in: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Signed out successfully.');
      eventManager.emit('auth:signed-out', {});
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error(`Error signing out: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
