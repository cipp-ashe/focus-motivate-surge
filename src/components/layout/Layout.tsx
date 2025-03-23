
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-grow w-full px-4 pb-6">
        <div className="container mx-auto py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
