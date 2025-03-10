
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from 'sonner';
import { TaskProvider } from './contexts/tasks/TaskContext';
import { AppLayout } from './components/AppLayout';

// Lazy load page components
const IndexPage = lazy(() => import('./pages/Index'));
const TimerPage = lazy(() => import('./pages/Timer'));
const NotesPage = lazy(() => import('./pages/Notes'));
const HabitsPage = lazy(() => import('./pages/Habits'));
const TaskPage = lazy(() => import('./pages/TaskPage'));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TaskProvider>
          <Routes>
            <Route path="/" element={
              <Suspense fallback={<div>Loading...</div>}>
                <IndexPage />
              </Suspense>
            } />
            <Route path="/timer" element={
              <Suspense fallback={<div>Loading...</div>}>
                <TimerPage />
              </Suspense>
            } />
            <Route path="/notes" element={
              <Suspense fallback={<div>Loading...</div>}>
                <NotesPage />
              </Suspense>
            } />
            <Route path="/habits" element={
              <Suspense fallback={<div>Loading...</div>}>
                <HabitsPage />
              </Suspense>
            } />
            <Route path="/tasks" element={
              <Suspense fallback={<div>Loading...</div>}>
                <TaskPage />
              </Suspense>
            } />
          </Routes>
        </TaskProvider>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
