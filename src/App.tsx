
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';
import { TaskProvider } from './contexts/tasks/TaskContext';
import { AppLayout } from './components/AppLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Lazy load page components
const IndexPage = lazy(() => import('./pages/Index'));
const TimerPage = lazy(() => import('./pages/Timer'));
const NotesPage = lazy(() => import('./pages/Notes'));
const HabitsPage = lazy(() => import('./pages/Habits'));
const TaskPage = lazy(() => import('./pages/TaskPage'));

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TaskProvider>
            <AppLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/timer" element={<TimerPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/habits" element={<HabitsPage />} />
                  <Route path="/tasks" element={<TaskPage />} />
                </Routes>
              </Suspense>
            </AppLayout>
          </TaskProvider>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

export default App;
