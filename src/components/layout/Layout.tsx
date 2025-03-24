
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full">
        <div className="container mx-auto py-4 px-4 pb-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
