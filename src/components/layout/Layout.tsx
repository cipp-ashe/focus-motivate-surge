
import React, { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header />
      <main className="flex-grow w-full pb-16 md:pb-0">
        <div className="container mx-auto py-4 px-4 pb-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
