
import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './layout/Header';
import { useTheme } from '@/hooks/useTheme';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  // Only hide header on the main dashboard page
  const showHeader = location.pathname !== '/';
  
  // Apply theme class to document when component mounts
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {showHeader && <Header />}
      <main className="container mx-auto max-w-5xl">
        {children}
      </main>
    </div>
  );
};
