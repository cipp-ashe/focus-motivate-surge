
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './layout/Header';
import { HabitProvider } from '@/contexts/habits/HabitContext';

export const AppLayout = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <HabitProvider>
      <div className="min-h-screen">
        {showHeader && <Header />}
        <main>
          <Outlet />
        </main>
      </div>
    </HabitProvider>
  );
};
