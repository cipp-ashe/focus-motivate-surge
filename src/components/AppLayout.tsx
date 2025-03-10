
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './layout/Header';

export const AppLayout = () => {
  const location = useLocation();
  // Only hide header on the main dashboard page
  const showHeader = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {showHeader && <Header />}
      <main className="h-full">
        <Outlet />
      </main>
    </div>
  );
};
