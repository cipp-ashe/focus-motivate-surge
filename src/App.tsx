
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import Layout from '@/components/layout/Layout';
import IndexPage from '@/pages/Index';
import TasksPage from '@/pages/TasksPage';
import TimerPage from '@/pages/Timer';
import NotesPage from '@/pages/Notes';
import HabitsPage from '@/pages/Habits';
import SettingsPage from '@/pages/Settings';
import ScreenshotsPage from '@/pages/Screenshots';
import VoiceNotesPage from '@/pages/VoiceNotes';
import { ThemeProvider } from '@/components/theme-provider';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { NoteProvider } from '@/contexts/notes/NoteContext';
import { HabitProvider } from '@/contexts/habits/HabitContext';
import { VoiceNotesProvider } from '@/contexts/voiceNotes/VoiceNotesContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="focus-notes-theme">
        <AuthProvider>
          <TaskProvider>
            <NoteProvider>
              <HabitProvider>
                <VoiceNotesProvider>
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    
                    <Route path="/" element={
                      <RequireAuth requireAuth={false}>
                        <Layout />
                      </RequireAuth>
                    }>
                      <Route index element={<IndexPage />} />
                      <Route path="tasks" element={<TasksPage />} />
                      <Route path="timer" element={<TimerPage />} />
                      <Route path="notes" element={<NotesPage />} />
                      <Route path="habits" element={<HabitsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="screenshots" element={<ScreenshotsPage />} />
                      <Route path="voice-notes" element={<VoiceNotesPage />} />
                    </Route>
                  </Routes>
                </VoiceNotesProvider>
              </HabitProvider>
            </NoteProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
