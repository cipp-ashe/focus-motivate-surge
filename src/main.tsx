
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from '@/contexts/auth/AuthContext';
import { TaskProvider } from '@/contexts/tasks/TaskContext';
import { DebugProvider } from '@/providers/DebugProvider';

// Initialize application
import { initializeApplication } from './utils/appInitialization';

// Run initialization before rendering
initializeApplication();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
