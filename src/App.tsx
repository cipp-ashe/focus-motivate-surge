
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AppLayout } from '@/components/AppLayout';
import IndexPage from '@/pages/Index';
import TaskPage from '@/pages/Tasks';
import TimerPage from '@/pages/Timer';
import HabitsPage from '@/pages/Habits';
import NotesPage from '@/pages/Notes';
import ScreenshotsPage from '@/pages/Screenshots';
import VoiceNotesPage from '@/pages/VoiceNotes';

// Add the HabitProvider import
import { HabitProvider } from './contexts/habits/HabitContext';
import { TaskProvider } from './contexts/tasks/TaskContext';
import { VoiceNotesProvider } from './contexts/voiceNotes/VoiceNotesContext';
import { NoteProvider } from './contexts/notes/NoteContext';
import { eventManager } from './lib/events/EventManager';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  useEffect(() => {
    console.log("App component mounted");
    
    // Report successful app initialization after a small delay
    setTimeout(() => {
      console.log("App initialization complete");
      eventManager.emit('app:initialization-complete', {});
    }, 500);
    
    // Listen for route changes
    const handleRouteChange = () => {
      console.log("Route changed to:", window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <div className="app bg-background text-foreground">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            {/* Rearranged provider order to ensure NoteProvider wraps VoiceNotesProvider */}
            <NoteProvider>
              <VoiceNotesProvider>
                <HabitProvider>
                  <TaskProvider>
                    <AppLayout>
                      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                        <main className="min-h-[100vh]">
                          <Routes>
                            <Route path="/" element={<IndexPage />} />
                            <Route path="/tasks" element={<TaskPage />} />
                            <Route path="/timer" element={<TimerPage />} />
                            <Route path="/habits" element={<HabitsPage />} />
                            <Route path="/notes" element={<NotesPage />} />
                            <Route path="/screenshots" element={<ScreenshotsPage />} />
                            <Route path="/voice-notes" element={<VoiceNotesPage />} />
                          </Routes>
                        </main>
                      </Suspense>
                    </AppLayout>
                  </TaskProvider>
                </HabitProvider>
              </VoiceNotesProvider>
            </NoteProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster 
        position="bottom-right" 
        duration={2000}  
        closeButton
        expand={false}
        offset={16}
        toastOptions={{
          className: "bg-background border border-border text-foreground",
          descriptionClassName: "text-muted-foreground",
          style: {
            border: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)'
          }
        }}
      />
    </div>
  );
}

export default App;
