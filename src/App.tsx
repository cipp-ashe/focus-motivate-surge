
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import Layout from '@/components/layout/Layout';
import TaskPage from '@/pages/Tasks';
import TimerPage from '@/pages/Timer';
import NotesPage from '@/pages/Notes';
import HabitsPage from '@/pages/Habits';
import SettingsPage from '@/pages/Settings';
import { ThemeProvider } from '@/components/theme-provider';
import { TaskProvider } from '@/contexts/tasks/TaskContext';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="focus-notes-theme">
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route path="/" element={
                <RequireAuth requireAuth={false}>
                  <Layout />
                </RequireAuth>
              }>
                <Route index element={<Navigate to="/tasks" replace />} />
                <Route path="tasks" element={<TaskPage />} />
                <Route path="timer" element={<TimerPage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="habits" element={<HabitsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
