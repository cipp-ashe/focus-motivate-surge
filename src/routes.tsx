
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import TimerPage from './pages/Timer';

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
