
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Strict mode can help with finding bugs but sometimes causes double rendering
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
