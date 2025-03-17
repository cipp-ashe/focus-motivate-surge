
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import App from './App';
import IndexPage from './pages/Index';
import TasksPage from './pages/TasksPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TaskProvider>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<IndexPage />} />
              <Route path="tasks" element={<TasksPage />} />
              {/* Add other routes as needed */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </TaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
