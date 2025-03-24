
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from 'next-themes';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { useTaskEvents } from '@/hooks/tasks/useTaskEvents';
import { useHabitEvents } from '@/hooks/habits/useHabitEvents';
import { useNoteActions } from '@/contexts/notes/hooks';
import { JournalProvider } from './components/journal/JournalProvider';
import { eventManager } from '@/lib/events/EventManager';

const App: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();
  const isMobile = useIsMobile();
  const { forceTaskUpdate } = useTaskEvents();
  const { checkPendingHabits } = useHabitEvents();
  const { loadNotes } = useNoteActions();
  
  useEffect(() => {
    setMounted(true);
    
    // Load initial theme from localStorage
    const storedTheme = localStorage.getItem('vite-ui-theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    // Force task update on app initialization
    forceTaskUpdate();
    
    // Check for pending habits on app initialization
    checkPendingHabits();
    
    // Load notes on app initialization
    loadNotes();
    
    // Dispatch app initialized event via event manager
    eventManager.emit('app:initialized', { timestamp: new Date().toISOString() });
  }, [setTheme, forceTaskUpdate, checkPendingHabits, loadNotes]);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <JournalProvider>
        <Toaster />
      </JournalProvider>
    </ThemeProvider>
  );
};

export default App;
