
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { Toaster } from './components/ui/sonner'; // Updated import path
import { ThemeProvider } from './components/theme-provider'; // Updated import path
import { initializeApplication } from './utils/appInitialization';

export default function App() {
  // Run initialization on app startup
  useEffect(() => {
    initializeApplication();
  }, []);

  return (
    <ThemeProvider>
      <Layout>
        <Outlet />
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}
