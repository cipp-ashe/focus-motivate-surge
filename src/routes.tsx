
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import TimerPage from './pages/Timer';

// This file is retained for reference but is not actively used
// The main routing is handled by router.tsx
// Define the application routes
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/tasks" replace />
  },
  {
    path: '/tasks',
    element: <TasksPage />
  },
  {
    path: '/task',
    element: <Navigate to="/tasks" replace />  // Redirect old /task route to /tasks
  },
  {
    path: '/timer',
    element: <TimerPage />
  }
];
