
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './layout/Header';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  // Only hide header on the main dashboard page
  const showHeader = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {showHeader && <Header />}
      <main className="container mx-auto max-w-5xl">
        {children}
      </main>
    </div>
  );
};
