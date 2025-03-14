
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/theme/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { RequireAuth } from '@/components/auth/RequireAuth';
import Auth from '@/pages/Auth';
import Layout from '@/components/layout/Layout';
import TaskPage from '@/pages/Tasks';
import TimerPage from '@/pages/Timer';
import NotesPage from '@/pages/Notes';
import HabitsPage from '@/pages/Habits';
import SettingsPage from '@/pages/Settings';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route path="/" element={
              <RequireAuth>
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
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
