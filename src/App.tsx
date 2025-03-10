
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppLayout from '@/layouts/AppLayout';
import IndexPage from '@/pages/Index';
import TaskPage from '@/pages/Tasks';
import TimerPage from '@/pages/Timer';
import HabitsPage from '@/pages/Habits';
import NotesPage from '@/pages/Notes';
import ScreenshotsPage from '@/pages/Screenshots';

// Add the HabitProvider import
import { HabitProvider } from './contexts/habits/HabitContext';
import { TaskProvider } from './contexts/tasks/TaskContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="app bg-background text-foreground">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            {/* Add HabitProvider here, wrapping the TaskProvider */}
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
                      </Routes>
                    </main>
                  </Suspense>
                </AppLayout>
              </TaskProvider>
            </HabitProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
